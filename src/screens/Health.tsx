import React, {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet, Dimensions, Linking, StatusBar} from 'react-native';
import {
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  Camera as VisionCamera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import Svg, {Circle, Line} from 'react-native-svg';
import {
  Button,
  ButtonText,
  CameraIcon,
  CameraImage,
  Container,
  NumContainer,
  NumText,
} from './Health.style';
import {detectPose} from './detectPose';
import {Worklets} from 'react-native-worklets-core';
import {
  calculateAngle,
  detectOutlier,
  updateStateAndFeedback,
} from './calculate_feedback';
import {audioBytesList} from '../mockAudioData';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import AndroidSystemBars from 'react-native-system-bars';

export default function Health() {
  type RouteParams = {
    id: number;
    repCount: number;
    premium: boolean;
  };
  const route = useRoute<RouteProp<{params: RouteParams}, 'params'>>();
  const {repCount: initialRepCount} = route.params; // 'repCount'를 'initialRepCount'로 변경

  const navigation = useNavigation();
  const targetRepCount = initialRepCount; // 목표 repCount
  const [hasPermission, setHasPermission] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const [pose, setPose] = useState(null);
  const cameraRef = useRef(null);

  const devices = useCameraDevices();
  const backCamera = devices?.find(device => device.position === 'back');
  const frontCamera = devices?.find(device => device.position === 'front');
  const currentCamera = useFrontCamera ? frontCamera : backCamera;

  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

  const [state, setState] = useState<string | null>(null);
  const [repCount, setRepCount] = useState(0);
  const previousAngles = useRef({
    elbowAngle: null,
    hipAngle: null,
    kneeAngle: null,
  });
  const [booleans, setBooleans] = useState({
    elbow: true,
    hip: false,
    knee: false,
  });

  const [isTargetReached, setIsTargetReached] = useState(false);

  const convertBooleansObjectToArray = booleans => {
    return Object.values(booleans);
  };

  // 각 음성 파일을 지정된 이름으로 저장할 경로 설정
  const audioPaths = audioBytesList.map(
    (_, index) => `${RNFS.DocumentDirectoryPath}/audio${index + 1}.wav`,
  );

  const setupAudioFiles = async () => {
    // 각 파일이 존재하는지 확인하고 없으면 생성
    await Promise.all(
      audioBytesList.map(async (audioBytes, index) => {
        const path = audioPaths[index];
        const fileExists = await RNFS.exists(path);
        if (!fileExists) {
          await RNFS.writeFile(path, audioBytes, 'base64');
        }
      }),
    );
  };

  const playAudio = audioPath => {
    return new Promise(resolve => {
      const sound = new Sound(audioPath, '', error => {
        if (error) {
          console.error('오디오 파일 로드 오류:', error);
          resolve();
          return;
        }
        sound.play(success => {
          if (success) {
            console.log('성공적으로 재생되었습니다.');
          } else {
            console.error('재생 오류');
          }
          sound.release();
          resolve(); // 다음 파일로 이동
        });
      });
    });
  };

  const playAudioWithDelay = (audioPath, delay = 1000) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const sound = new Sound(audioPath, '', error => {
          if (error) {
            console.error('오디오 파일 로드 오류:', error);
            resolve();
            return;
          }
          sound.play(success => {
            if (success) {
              console.log('성공적으로 재생되었습니다.');
            } else {
              console.error('재생 오류');
            }
            sound.release();
            resolve(); // 다음 파일로 이동
          });
        });
      }, delay);
    });
  };
  const calculateFalsePercentage = array => {
    const falseCount = array.filter(value => value === 0).length;
    console.log('calculateFalseCount:', falseCount);
    return Math.floor((100 * falseCount) / array.length);
  };

  useEffect(() => {
    // 상태 표시줄 및 네비게이션 바 숨기기
    AndroidSystemBars.hideStatusAndNavigationBars();

    return () => {
      // 컴포넌트 해제 시 상태 표시줄 복구
      AndroidSystemBars.setSystemUIVisibility('SYSTEM_UI_FLAG_VISIBLE');
    };
  }, []);

  useEffect(() => {
    // 상태 표시줄 숨기기
    StatusBar.setHidden(true); // 상태 표시줄 숨기기
    return () => {
      StatusBar.setHidden(false); // 화면에서 벗어날 때 다시 표시
    };
  }, []);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 한 번만 음성 파일을 설정
    setupAudioFiles().catch(error =>
      console.error('오디오 파일 설정 오류:', error),
    );
  }, []);

  // 불리언 배열 상태
  const [booleansElbowArray, setBooleansElbowArray] = useState<number[]>([]);
  const [booleansHipArray, setBooleansHipArray] = useState<number[]>([]);
  const [booleansKneeArray, setBooleansKneeArray] = useState<number[]>([]);

  useEffect(() => {
    const checkPermission = async () => {
      const cameraPermission = await VisionCamera.getCameraPermissionStatus();
      if (cameraPermission === 'authorized' || cameraPermission === 'granted') {
        setHasPermission(true);
      } else if (cameraPermission === 'not-determined') {
        const newCameraPermission =
          await VisionCamera.requestCameraPermission();
        setHasPermission(
          newCameraPermission === 'authorized' ||
            newCameraPermission === 'granted',
        );
        if (newCameraPermission === 'denied') await Linking.openSettings();
      } else {
        await Linking.openSettings();
      }
    };
    checkPermission();
  }, []);

  const lastUpdateTimeRef = useRef(Date.now());
  const UPDATE_INTERVAL = 50;

  const setPoseInJS = Worklets.createRunOnJS((newPose: PoseType) => {
    const currentTime = Date.now();
    if (
      currentTime - lastUpdateTimeRef.current > UPDATE_INTERVAL &&
      (!pose ||
        Object.keys(newPose.pose).some(
          key =>
            newPose.pose[key]?.x !== pose.pose[key]?.x ||
            newPose.pose[key]?.y !== pose.pose[key]?.y,
        ))
    ) {
      lastUpdateTimeRef.current = currentTime;
      setPose(newPose);
    }
  });

  const frameProcessor = useFrameProcessor((frame: Frame): void => {
    'worklet';
    const frameWidth = frame.width;
    const frameHeight = frame.height;
    const data: PoseType = detectPose(frame, {});
    setPoseInJS({pose: data, frameWidth, frameHeight});
  }, []);

  useEffect(() => {
    if (!isTargetReached && pose) {
      const rightWrist = pose.pose.rightWristPosition;
      const rightElbow = pose.pose.rightElbowPosition;
      const rightShoulder = pose.pose.rightShoulderPosition;
      const rightHip = pose.pose.rightHipPosition;
      const rightKnee = pose.pose.rightKneePosition;
      const rightAnkle = pose.pose.rightAnklePosition;

      if (
        rightWrist &&
        rightElbow &&
        rightShoulder &&
        rightHip &&
        rightKnee &&
        rightAnkle
      ) {
        const elbowAngle = calculateAngle(
          rightWrist,
          rightElbow,
          rightShoulder,
        );
        const hipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
        const kneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

        if (
          !detectOutlier(elbowAngle, previousAngles.current.elbowAngle) &&
          !detectOutlier(hipAngle, previousAngles.current.hipAngle) &&
          !detectOutlier(kneeAngle, previousAngles.current.kneeAngle)
        ) {
          updateStateAndFeedback(
            elbowAngle,
            hipAngle,
            kneeAngle,
            state,
            setState,
            setRepCount,
            booleans,
            setBooleans,
          );

          if (state === 'finished' && !isTargetReached) {
            setBooleansElbowArray(prev => {
              const updatedArray = [...prev, booleans.elbow ? 1 : 0];
              console.log('UpdatedBooleansElbowArray:', updatedArray);
              return updatedArray;
            });
            setBooleansHipArray(prev => {
              const updatedArray = [...prev, booleans.hip ? 1 : 0];
              console.log('UpdatedBooleansHipArray:', updatedArray);
              return updatedArray;
            });
            setBooleansKneeArray(prev => {
              const updatedArray = [...prev, booleans.knee ? 1 : 0];
              console.log('UpdatedBooleansKneeArray:', updatedArray);
              return updatedArray;
            });

            playAudio(audioPaths[7 + repCount]);
            setTimeout(() => {}, 1000);
            const booleansArray = convertBooleansObjectToArray(booleans);
            if (
              booleansArray.every(
                (value, index) => value === [false, false, false][index],
              )
            ) {
              playAudioWithDelay(audioPaths[0]);
              // 모든 값이 [false, false, false]와 동일할 때
              console.log('Good');
            } else if (
              booleansArray.every(
                (value, index) => value === [true, false, false][index],
              )
            ) {
              // 모든 값이 [true, false, false]와 동일할 때
              playAudioWithDelay(audioPaths[1]);
              console.log('Elbow');
            } else if (
              booleansArray.every(
                (value, index) => value === [false, true, false][index],
              )
            ) {
              // 모든 값이 [false, true, false]와 동일할 때
              playAudioWithDelay(audioPaths[2]);
              console.log('Hip');
            } else if (
              booleansArray.every(
                (value, index) => value === [false, false, true][index],
              )
            ) {
              // 모든 값이 [false, false, true]와 동일할 때
              playAudioWithDelay(audioPaths[3]);
              console.log('Knee');
            } else if (
              booleansArray.every(
                (value, index) => value === [true, true, false][index],
              )
            ) {
              // 모든 값이 [true, true, false]와 동일할 때
              playAudioWithDelay(audioPaths[4]);
              console.log('Elbow & Hip');
            } else if (
              booleansArray.every(
                (value, index) => value === [true, false, true][index],
              )
            ) {
              // 모든 값이 [true, false, true]와 동일할 때
              playAudioWithDelay(audioPaths[5]);
              console.log('Elbow & Knee');
            } else if (
              booleansArray.every(
                (value, index) => value === [false, true, true][index],
              )
            ) {
              // 모든 값이 [false, true, true]와 동일할 때
              playAudioWithDelay(audioPaths[6]);
              console.log('Hip & Knee');
            } else {
              // 모든 값이 [true, true, true]와 동일할 때
              playAudioWithDelay(audioPaths[7]);
              console.log('Elbow & Hip & Knee');
            }
            // 상태 초기화
            setState('initial');
            setBooleans({elbow: true, hip: false, knee: false});
          }
        }

        previousAngles.current = {elbowAngle, hipAngle, kneeAngle};
      }
    }
  }, [pose, booleans, state, repCount]);

  useEffect(() => {
    if (repCount >= targetRepCount && !isTargetReached) {
      console.log('목표 횟수에 도달했습니다.');
      console.log('아래 배열 잘 들어가있는지 확인');
      console.log('booleansElbowArray:', booleansElbowArray);
      console.log('booleansHipArray:', booleansHipArray);
      console.log('booleansKneeArray:', booleansKneeArray);
      console.log(
        '위 값이 잘 들어있다면, 계산이 문제일 확률 높음 => false로 인식하지 않고, 0으로 인식한다던가',
      );
      console.log(
        '지금 resultArray계산은 false의 개수를 세는 것인데, false로 인식하지 않으면 개수가 0개일 것',
      );

      const resultArray = [
        calculateFalsePercentage(booleansElbowArray),
        calculateFalsePercentage(booleansHipArray),
        calculateFalsePercentage(booleansKneeArray),
      ];

      console.log('최종 resultArray 잘 들어가있는지 확인');

      console.log('Result Array:', resultArray);

      // 페이지 이동 전에 isTargetReached 상태 업데이트
      setIsTargetReached(true);
      setTimeout(() => {
        navigation.navigate('HealthResult', {
          id: route.params?.id,
          resultArray,
          premium: route.params?.premium,
        });
      }, 2000);
    }
  }, [booleansElbowArray, booleansHipArray, booleansKneeArray, repCount]);

  if (!hasPermission) {
    return (
      <View>
        <Text>카메라 권한을 확인 중입니다...</Text>
      </View>
    );
  }

  if (!currentCamera) {
    return (
      <View>
        <Text>카메라 장치를 찾을 수 없습니다...</Text>
      </View>
    );
  }

  const renderPoseDots = () => {
    if (!pose || !pose.frameWidth || !pose.frameHeight) return null;

    const {pose: poseData, frameWidth, frameHeight} = pose;
    const keysToRender = [
      'nosePosition',
      'leftEarPosition',
      'rightEarPosition',
      'leftShoulderPosition',
      'rightShoulderPosition',
      'leftElbowPosition',
      'rightElbowPosition',
      'leftWristPosition',
      'rightWristPosition',
      'leftHipPosition',
      'rightHipPosition',
      'leftKneePosition',
      'rightKneePosition',
      'leftAnklePosition',
      'rightAnklePosition',
    ];

    const connections = [
      ['nosePosition', 'leftEarPosition'],
      ['nosePosition', 'rightEarPosition'],
      ['leftShoulderPosition', 'rightShoulderPosition'],
      ['leftShoulderPosition', 'leftElbowPosition'],
      ['leftElbowPosition', 'leftWristPosition'],
      ['rightShoulderPosition', 'rightElbowPosition'],
      ['rightElbowPosition', 'rightWristPosition'],
      ['leftShoulderPosition', 'leftHipPosition'],
      ['rightShoulderPosition', 'rightHipPosition'],
      ['leftHipPosition', 'rightHipPosition'],
      ['leftHipPosition', 'leftKneePosition'],
      ['leftKneePosition', 'leftAnklePosition'],
      ['rightHipPosition', 'rightKneePosition'],
      ['rightKneePosition', 'rightAnklePosition'],
    ];

    const points = keysToRender
      .filter(key => poseData[key])
      .map(key => {
        const point = poseData[key];
        const x = useFrontCamera
          ? screenWidth - ((point.x / frameWidth) * screenWidth * 2 - 100) // 좌우 반전 (전면 카메라)
          : (point.x / frameWidth) * screenWidth * 2 - 100; // 좌우 반전 없음 (후면 카메라)
        const y = (point.y / frameHeight) * screenHeight * 0.8 - 30;

        return {key, x, y};
      });

    return (
      <Svg
        style={{
          position: 'absolute',
          width: screenWidth,
          height: screenHeight,
        }}>
        {connections.map(([key1, key2], index) => {
          const point1 = points.find(p => p.key === key1);
          const point2 = points.find(p => p.key === key2);
          if (point1 && point2) {
            return (
              <Line
                key={`line-${index}`}
                x1={point1.x}
                y1={point1.y}
                x2={point2.x}
                y2={point2.y}
                stroke="blue"
                strokeWidth={2}
              />
            );
          }
          return null;
        })}
        {points.map((point, index) => (
          <Circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r={4}
            fill="red"
          />
        ))}
      </Svg>
    );
  };

  return (
    <Container>
      <VisionCamera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={currentCamera}
        isActive={true}
        frameProcessor={frameProcessor}
      />
      {renderPoseDots()}
      <NumContainer
        style={{width: '13%', justifyContent: 'center', alignItems: 'center'}}>
        <NumText
          style={{fontSize: 24, paddingHorizontal: 20, textAlign: 'center'}}>
          {repCount}
        </NumText>
      </NumContainer>
      <CameraIcon onPress={() => setUseFrontCamera(!useFrontCamera)}>
        <CameraImage
          source={require('../assets/images/uil_camera-change.png')}
        />
      </CameraIcon>
      <Button
        onPress={() =>
          navigation.navigate('HealthResult', {
            id: route.params?.id,
            resultArray: [
              booleansElbowArray,
              booleansHipArray,
              booleansKneeArray,
            ],
          })
        }>
        <ButtonText>운동 결과 보기</ButtonText>
      </Button>
    </Container>
  );
}

const styles = StyleSheet.create({
  numContainer: {
    position: 'absolute',
    top: 10,
    left: '50%',
    transform: [{translateX: -50}],
    alignItems: 'center',
  },
});
