import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Linking } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Camera as VisionCamera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import Svg, { Circle, Line } from 'react-native-svg';
import { Button, ButtonText, CameraIcon, CameraImage, Container, NumContainer, NumText } from './Health.style';
import { detectPose } from './detectPose';
import { Worklets } from 'react-native-worklets-core';
import { calculateAngle, detectOutlier, updateStateAndFeedback } from './calculate_feedback';

export default function Health() {
    const route = useRoute();
    const navigation = useNavigation();
    const targetRepCount = 5; // 목표 repCount
    const [hasPermission, setHasPermission] = useState(false);
    const [useFrontCamera, setUseFrontCamera] = useState(false);
    const [pose, setPose] = useState(null);
    const cameraRef = useRef(null);

    const devices = useCameraDevices();
    const backCamera = devices?.find(device => device.position === 'back');
    const frontCamera = devices?.find(device => device.position === 'front');
    const currentCamera = useFrontCamera ? frontCamera : backCamera;

    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    const [state, setState] = useState<string | null>(null);
    const [repCount, setRepCount] = useState(0);
    const previousAngles = useRef({ elbowAngle: null, hipAngle: null, kneeAngle: null });
    const [booleans, setBooleans] = useState({
        elbow: true,
        hip: false,
        knee: false,
    });

    const convertBooleansObjectToArray = (booleans) => {
        return Object.values(booleans);
    };

    // 불리언 배열 상태
    const [booleansElbowArray, setBooleansElbowArray] = useState<number[]>([]);
    const [booleansHipArray, setBooleansHipArray] = useState<number[]>([]);
    const [booleansKneeArray, setBooleansKneeArray] = useState<number[]>([]);

    useFocusEffect(() => {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
        return () => navigation.getParent()?.setOptions({ tabBarStyle: undefined });
    });

    useEffect(() => {
        const checkPermission = async () => {
            const cameraPermission = await VisionCamera.getCameraPermissionStatus();
            if (cameraPermission === 'authorized' || cameraPermission === 'granted') {
                setHasPermission(true);
            } else if (cameraPermission === 'not-determined') {
                const newCameraPermission = await VisionCamera.requestCameraPermission();
                setHasPermission(newCameraPermission === 'authorized' || newCameraPermission === 'granted');
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
            (!pose || Object.keys(newPose.pose).some(
                key => newPose.pose[key]?.x !== pose.pose[key]?.x || newPose.pose[key]?.y !== pose.pose[key]?.y
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
        setPoseInJS({ pose: data, frameWidth, frameHeight });
    }, []);

    useEffect(() => {
        if (repCount >= targetRepCount) {
            console.log('목표 횟수에 도달했습니다.');

            const calculateFalsePercentage = (array) => {
                const falseCount = array.filter(value => value === false).length;
                return Math.floor(100 * falseCount / array.length);
            };

            const resultArray = [
                calculateFalsePercentage(booleansElbowArray),
                calculateFalsePercentage(booleansHipArray),
                calculateFalsePercentage(booleansKneeArray)
            ];

            console.log('Result Array:', resultArray);

            navigation.navigate('HealthResult', { id: route.params?.id, resultArray });
            return;
        }

        if (pose) {
            const rightWrist = pose.pose.rightWristPosition;
            const rightElbow = pose.pose.rightElbowPosition;
            const rightShoulder = pose.pose.rightShoulderPosition;
            const rightHip = pose.pose.rightHipPosition;
            const rightKnee = pose.pose.rightKneePosition;
            const rightAnkle = pose.pose.rightAnklePosition;

            if (rightWrist && rightElbow && rightShoulder && rightHip && rightKnee && rightAnkle) {
                const elbowAngle = calculateAngle(rightWrist, rightElbow, rightShoulder);
                const hipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
                const kneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

                if (
                    !detectOutlier(elbowAngle, previousAngles.current.elbowAngle) &&
                    !detectOutlier(hipAngle, previousAngles.current.hipAngle) &&
                    !detectOutlier(kneeAngle, previousAngles.current.kneeAngle)
                ) {
                    updateStateAndFeedback(elbowAngle, hipAngle, kneeAngle, state, setState, setRepCount, booleans, setBooleans);

                    if (state === 'finished') {
                        setBooleansElbowArray(prev => [...prev, booleans.elbow ? 1 : 0]);
                        setBooleansHipArray(prev => [...prev, booleans.hip ? 1 : 0]);
                        setBooleansKneeArray(prev => [...prev, booleans.knee ? 1 : 0]);

                        const booleansArray = convertBooleansObjectToArray(booleans);
                        console.log(booleansArray)
                        /*if (booleansArray === [false, false, false])
                        else if (booleansArray === [true, false, false])
                        else if (booleansArray === [false, true, false])
                        else if (booleansArray === [false, false, true])
                        else if (booleansArray === [true, true, false])
                        else if (booleansArray === [true, false, true])
                        else if (booleansArray === [false, true, true])
                        else*/
                        // 상태 초기화
                        setState(null);
                        setBooleans({ elbow: true, hip: false, knee: false });
                    }
                }

                previousAngles.current = { elbowAngle, hipAngle, kneeAngle };
            }
        }
    }, [pose, booleans, state, repCount, targetRepCount, booleansElbowArray, booleansHipArray, booleansKneeArray]);

    if (!hasPermission) {
        return <View><Text>카메라 권한을 확인 중입니다...</Text></View>;
    }

    if (!currentCamera) {
        return <View><Text>카메라 장치를 찾을 수 없습니다...</Text></View>;
    }

    const renderPoseDots = () => {
      if (!pose || !pose.frameWidth || !pose.frameHeight) return null;

      const { pose: poseData, frameWidth, frameHeight } = pose;
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
          'rightAnklePosition'
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
          ['rightKneePosition', 'rightAnklePosition']
      ];

      const points = keysToRender
          .filter(key => poseData[key])
          .map(key => {
              const point = poseData[key];
              const x = useFrontCamera
                  ? screenWidth - ((((point.x / frameWidth) * screenWidth) * 2) - 100) // 좌우 반전 (전면 카메라)
                  : (((point.x / frameWidth) * screenWidth) * 2) - 100; // 좌우 반전 없음 (후면 카메라)
              const y = (((point.y / frameHeight) * screenHeight) * 0.8) - 30;

              return { key, x, y };
          });

      return (
          <Svg style={{ position: 'absolute', width: screenWidth, height: screenHeight }}>
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
                  <Circle key={`point-${index}`} cx={point.x} cy={point.y} r={4} fill="red" />
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
            <NumContainer style={{ width: '13%', justifyContent: 'center', alignItems: 'center' }}>
                <NumText style={{ fontSize: 24, paddingHorizontal: 20, textAlign: 'center' }}>
                    {repCount}
                </NumText>
            </NumContainer>
            <CameraIcon onPress={() => setUseFrontCamera(!useFrontCamera)}>
                <CameraImage source={require('../assets/images/uil_camera-change.png')} />
            </CameraIcon>
            <Button onPress={() => navigation.navigate('HealthResult', { id: route.params?.id, resultArray: [booleansElbowArray, booleansHipArray, booleansKneeArray] })}>
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
        transform: [{ translateX: -50 }],
        alignItems: 'center',
    },
});
