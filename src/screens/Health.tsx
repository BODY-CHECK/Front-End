import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Linking, AppState } from 'react-native';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Camera as VisionCamera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import Svg, { Circle, Line } from 'react-native-svg';
import { CameraIcon, CameraImage, Container, NumContainer, NumText } from './Health.style';
import { detectPose } from './detectPose';
import { Worklets } from 'react-native-worklets-core';
import { calculateAngle, calculateSlopeAngle, detectOutlier, updateStateAndFeedback, updateStateAndFeedbackwithTime, updateStateofTutorial } from './calculate_feedback';
import { countAudio } from '../countAudioData';
import { exerciseId1 } from '../exerciseId_1';
import { exerciseId2 } from '../exerciseId_2';
import { exerciseId3 } from '../exerciseId_3';
import { exerciseId4 } from '../exerciseId_4';
import { exerciseId5 } from '../exerciseId_5';
import { exerciseId6 } from '../exerciseId_6';
import { exerciseId7 } from '../exerciseId_7';
import { exerciseId8 } from '../exerciseId_8';
import { exerciseId9 } from '../exerciseId_9';
import { exerciseId10 } from '../exerciseId_10';
import { exerciseId11 } from '../exerciseId_11';
import { exerciseId12 } from '../exerciseId_12';
import { cameraVoice } from '../camera_voice';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import { setUpdateIntervalForType, SensorTypes, accelerometer } from 'react-native-sensors';
import AndroidSystemBars from 'react-native-system-bars';
import { stopRecording } from './Record';
import { useAuth } from '../AuthContext';

export default function Health() {
    type RouteParams = {
        id: number;
        repCount: number;
        premium: boolean;
    };
    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const { repCount: initialRepCount, id: exerciseType } = route.params; // 'repCount'를 'initialRepCount'로 변경
    const navigation = useNavigation();
    const targetRepCount = initialRepCount; // 목표 repCount
    const [hasPermission, setHasPermission] = useState(false);  // camera permission?
    const [useFrontCamera, setUseFrontCamera] = useState(false);    // Front Camera
    const [pose, setPose] = useState(null); // pose data
    const cameraRef = useRef(null);
    const {setIsLoggedIn} = useAuth();

    const devices = useCameraDevices();
    const backCamera = devices?.find(device => device.position === 'back');
    const frontCamera = devices?.find(device => device.position === 'front');
    const currentCamera = useFrontCamera ? frontCamera : backCamera;

    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    const [state, setState] = useState<string | null>(null);    // 현재 state
    const [repCount, setRepCount] = useState(0);    // 현재 repCount
    const previousAngles = useRef({ moveAngle: null, stop1Angle: null, stop2Angle: null }); // 직전 angles
    const [booleans, setBooleans] = useState({  // 현재 피드백 상태
        move: true,
        stop1: false,
        stop2: false,
    });
    let moveAngle, stop1Angle, stop2Angle, lieAngle;
    const [isTargetReached, setIsTargetReached] = useState(false);  // target repCount 도달 여부

    const convertBooleansObjectToArray = (booleans) => {    // 객체의 값들만 추출하여 배열로 변환
        return Object.values(booleans);
    };

    useEffect(() => {
        // 상태 표시줄 및 네비게이션 바 숨기기
        AndroidSystemBars.hideStatusAndNavigationBars();

        return () => {
          // 컴포넌트 해제 시 상태 표시줄 복구
          AndroidSystemBars.setSystemUIVisibility('SYSTEM_UI_FLAG_VISIBLE');
        };
      }, []);

      const [isRecording, setIsRecording] = useState(true); // 녹화 상태 관리
      const [isURL, setIsURL] = useState(null);


      useFocusEffect(
          React.useCallback(() => {
              console.log('Health 화면 포커스 받음');
              const onBeforeRemove = (event) => {
                  // 만약 특정 화면으로 이동한다면, 녹화 종료를 막음
                  if (event.data.action.type === 'NAVIGATE' && event.data.action.payload?.name === 'HealthResult') {
                      // HealthResult로 가는 경우라면 녹화 종료를 막음
                      return;
                  }
                  // 그 외의 경우에는 녹화를 종료
                  if (isRecording && route.params?.premium) {
                      stopRecording(setIsURL, setIsRecording);
                      console.log(isURL);
                  }
              };
              // 화면에서 벗어날 때 이벤트 리스너 추가
              navigation.addListener('beforeRemove', onBeforeRemove);
              return () => {
                  console.log('Health 화면 포커스 잃음');
                  navigation.removeListener('beforeRemove', onBeforeRemove);
              };
          }, [isRecording, route.params?.premium, navigation])
      );
  
      // AppState를 이용하여 앱 상태 변경 감지
      useEffect(() => {
          const handleAppStateChange = (nextAppState) => {
              if (nextAppState === 'background' || nextAppState === 'inactive') {
                  // 앱이 백그라운드로 전환되거나 비활성화될 때 녹화를 종료
                  if (isRecording && route.params?.premium) {
                      stopRecording(setIsURL, setIsRecording);
                      console.log('앱이 비활성화됨 - 녹화 종료');
                  }
              }
          };
  
          const subscription = AppState.addEventListener('change', handleAppStateChange);
  
          return () => {
              subscription.remove();
          };
      }, [isRecording, route.params?.premium]);
  
  
      useEffect(() => {
        // 컴포넌트가 마운트될 때 한 번만 음성 파일을 설정
        setupAudioFiles().catch(error =>
          console.error('오디오 파일 설정 오류:', error),
        );
      }, []);
  
    console.log('운동 숫자:', exerciseType);
    // 각 운동에 따른 관절 위치 정의
    const jointSets = {
        0: { // 튜토리얼
            move: ['rightElbowPosition', 'rightShoulderPosition', 'rightHipPosition'],
            stop1: ['leftElbowPosition', 'leftShoulderPosition', 'leftHipPosition'],
            stop2: ['rightElbowPosition', 'rightShoulderPosition', 'rightHipPosition'],
            lie: ['rightShoulderPosition', 'rightHipPosition'],
        },
        1: { // 푸쉬업
            move: ['rightWristPosition', 'rightElbowPosition', 'rightShoulderPosition'],    // 팔꿈치
            stop1: ['rightShoulderPosition', 'rightHipPosition', 'rightKneePosition'],      // 엉덩이
            stop2: ['rightHipPosition', 'rightKneePosition', 'rightAnklePosition'],         // 무릎
            lie: ['rightShoulderPosition', 'rightHipPosition'],
        },
        2: { // 푸쉬업(무릎)
            move: ['rightWristPosition', 'rightElbowPosition', 'rightShoulderPosition'],    // 팔꿈치
            stop1: ['rightShoulderPosition', 'rightHipPosition', 'rightKneePosition'],      // 엉덩이
            stop2: ['rightHipPosition', 'rightKneePosition', 'rightAnklePosition'],         // 시간
            lie: ['rightShoulderPosition', 'rightHipPosition'],
        },
        3: { // 풀업
            move: ['rightWristPosition', 'rightElbowPosition', 'rightShoulderPosition'],    // 팔꿈치
            stop1: ['rightShoulderPosition', 'rightHipPosition', 'rightKneePosition'],      // 엉덩이
            stop2: ['rightShoulderPosition', 'rightHipPosition', 'rightKneePosition'],      // 시간
            lie: ['rightShoulderPosition', 'rightHipPosition'],
        },
        4: { // 풀업 (밴드)
            move: ['rightWristPosition', 'rightElbowPosition', 'rightShoulderPosition'],    // 팔꿈치
            stop1: ['rightShoulderPosition', 'rightHipPosition', 'rightKneePosition'],      // 엉덩이
            stop2: ['rightShoulderPosition', 'rightHipPosition', 'rightKneePosition'],      // 시간
            lie: ['rightShoulderPosition', 'rightHipPosition'],
        },
        5: { // 윗몸 일으키기
            move: ['rightShoulderPosition', 'rightHipPosition', 'rightKneePosition'],       // 엉덩이
            stop1: ['rightHipPosition', 'rightKneePosition', 'rightAnklePosition'],         // 무릎
            stop2: ['rightHipPosition', 'rightKneePosition', 'rightAnklePosition'],         // 시간
            lie: ['rightShoulderPosition', 'rightHipPosition'],
        },
        6: { // 레그레이즈
            move: ['rightShoulderPosition', 'rightHipPosition', 'rightKneePosition'],       // 엉덩이
            stop1: ['rightHipPosition', 'rightKneePosition', 'rightAnklePosition'],         // 무릎
            stop2: ['nosePosition', 'rightShoulderPosition', 'rightHipPosition'],           // 시간
            lie: ['rightShoulderPosition', 'rightHipPosition'],
        },
        7: { // 행잉 레그레이즈
            move: ['rightShoulderPosition', 'rightHipPosition', 'rightKneePosition'],       // 엉덩이
            stop1: ['rightHipPosition', 'rightKneePosition', 'rightAnklePosition'],         // 무릎
            stop2: ['nosePosition', 'rightShoulderPosition', 'rightHipPosition'],           // 시간
            lie: ['rightShoulderPosition', 'rightHipPosition'],
        },
        8: { // 스쿼트
            move: ['rightHipPosition', 'rightKneePosition', 'rightAnklePosition'],          // 무릎
            stop1: ['rightKneePosition', 'rightAnklePosition', 'rightFootIndexPosition'],   // 발목
            stop2: ['rightShoulderPosition', 'rightHipPosition'],                           // 상체
            lie: ['rightShoulderPosition', 'rightHipPosition'],
        },
        9: { // 한 발 스쿼트
            move: ['rightHipPosition', 'rightKneePosition', 'rightAnklePosition'],          // 무릎
            stop1: ['rightKneePosition', 'rightAnklePosition', 'rightFootIndexPosition'],   // 발목
            stop2: ['rightShoulderPosition', 'rightHipPosition'],                           // 상체
            lie: ['rightShoulderPosition', 'rightHipPosition'],
        },
        10: { // 런지
            move: ['rightHipPosition', 'rightKneePosition', 'rightAnklePosition'],          // 무릎
            stop1: ['rightKneePosition', 'rightAnklePosition', 'rightFootIndexPosition'],   // 발목
            stop2: ['rightShoulderPosition', 'rightHipPosition'],                           // 상체
            lie: ['rightShoulderPosition', 'rightHipPosition'],
        },
        11: { // 카프레이즈
            move: ['rightKneePosition', 'rightHillPosition', 'rightFootIndexPosition'],     // 뒤꿈치
            stop1: ['rightHipPosition', 'rightKneePosition', 'rightAnklePosition'],         // 무릎
            stop2: ['rightShoulderPosition', 'rightHipPosition'],                           // 상체
            lie: ['rightShoulderPosition', 'rightHipPosition'],
        },
        12: { // 힙 쓰러스트
            move: ['rightShoulderPosition', 'rightHipPosition', 'rightKneePosition'],       // 엉덩이
            stop1: ['rightHipPosition', 'rightKneePosition', 'rightAnklePosition'],         // 무릎
            stop2: ['rightHipPosition', 'rightKneePosition', 'rightAnklePosition'],         // 시간
            lie: ['rightShoulderPosition', 'rightHipPosition'],
        },
        // 필요한 다른 운동 추가 가능
    };

    // 선택된 운동의 관절 세트
    const selectedJointSet = jointSets[exerciseType];

    // 카메라 반전 및 적용
    const convertToRenderedCoords = (point, frameWidth, frameHeight) => {
        if (!point) return null;
        const x = useFrontCamera
            ? screenWidth - (((point.x / frameWidth) * screenWidth) * 2 - 100) // 좌우 반전 (전면 카메라)
            : ((point.x / frameWidth) * screenWidth) * 2 - 100; // 좌우 반전 없음 (후면 카메라)
        const y = ((point.y / frameHeight) * screenHeight) * 0.8 - 30;
        return { x, y };
    };

    // 음성 파일 경로와 데이터를 상태로 관리
    const [audioPaths, setAudioPaths] = useState([]);
    const [exerciseAudioData, setExerciseAudioData] = useState([]);
    const [countAudioPaths, setCountAudioPaths] = useState([]);
    const [countAudioData, setCountAudioData] = useState([]);

    useEffect(() => {
        let paths = [];
        let audioData = [];
        if (Number(exerciseType) === 0) {
            paths = exerciseId1.map((_, index) => `${RNFS.DocumentDirectoryPath}/audio${index + 1}.wav`);
            audioData = exerciseId1;
        } else if (Number(exerciseType) === 1) {
            paths = exerciseId1.map((_, index) => `${RNFS.DocumentDirectoryPath}/audio${index + 1}.wav`);
            audioData = exerciseId1;
        } else if (Number(exerciseType) === 2) {
            paths = exerciseId2.map((_, index) => `${RNFS.DocumentDirectoryPath}/audio${index + 1}.wav`);
            audioData = exerciseId2;
        } else if (Number(exerciseType) === 3) {
            paths = exerciseId3.map((_, index) => `${RNFS.DocumentDirectoryPath}/audio${index + 1}.wav`);
            audioData = exerciseId3;
        } else if (Number(exerciseType) === 4) {
            paths = exerciseId4.map((_, index) => `${RNFS.DocumentDirectoryPath}/audio${index + 1}.wav`);
            audioData = exerciseId4;
        } else if (Number(exerciseType) === 5) {
            paths = exerciseId5.map((_, index) => `${RNFS.DocumentDirectoryPath}/audio${index + 1}.wav`);
            audioData = exerciseId5;
        } else if (Number(exerciseType) === 6) {
            paths = exerciseId6.map((_, index) => `${RNFS.DocumentDirectoryPath}/audio${index + 1}.wav`);
            audioData = exerciseId6;
        } else if (Number(exerciseType) === 7) {
            paths = exerciseId7.map((_, index) => `${RNFS.DocumentDirectoryPath}/audio${index + 1}.wav`);
            audioData = exerciseId7;
        } else if (Number(exerciseType) === 8) {
            paths = exerciseId8.map((_, index) => `${RNFS.DocumentDirectoryPath}/audio${index + 1}.wav`);
            audioData = exerciseId8;
        } else if (Number(exerciseType) === 9) {
            paths = exerciseId9.map((_, index) => `${RNFS.DocumentDirectoryPath}/audio${index + 1}.wav`);
            audioData = exerciseId9;
        } else if (Number(exerciseType) === 10) {
            paths = exerciseId10.map((_, index) => `${RNFS.DocumentDirectoryPath}/audio${index + 1}.wav`);
            audioData = exerciseId10;
        } else if (Number(exerciseType) === 11) {
            paths = exerciseId11.map((_, index) => `${RNFS.DocumentDirectoryPath}/audio${index + 1}.wav`);
            audioData = exerciseId11;
        } else if (Number(exerciseType) === 12) {
            paths = exerciseId12.map((_, index) => `${RNFS.DocumentDirectoryPath}/audio${index + 1}.wav`);
            audioData = exerciseId12;
        }
        setAudioPaths(paths);
        setExerciseAudioData(audioData);
    }, [exerciseType]);

    useEffect(() => {
        // countAudio 데이터의 길이에 따라 경로 생성
        const paths = countAudio.map((_, index) => `${RNFS.DocumentDirectoryPath}/count_audio${index + 1}.wav`);
        setCountAudioPaths(paths);
        setCountAudioData(countAudio);
    }, []);

    // 음성 파일 관련 설정
    const setupAudioFiles = async () => {
        await Promise.all(
            exerciseAudioData.map(async (audioBytes, index) => {
                const path = audioPaths[index];
                const fileExists = await RNFS.exists(path);
                if (fileExists) {
                    await RNFS.unlink(path); // 기존 파일 삭제
                }
                await RNFS.writeFile(path, audioBytes, 'base64');
            }),
        );
    };

    const setupCountAudioFiles = async () => {
        await Promise.all(
            countAudioData.map(async (audioBytes, index) => {
                const path = countAudioPaths[index];
                // 기존 파일 삭제 (필요에 따라)
                if (await RNFS.exists(path)) {
                    await RNFS.unlink(path);
                }
                await RNFS.writeFile(path, audioBytes, 'base64');
            }),
        );
    };

    // 음성 출력
    const playAudio = audioPath => {
        return new Promise(resolve => {
            const sound = new Sound(audioPath, '', error => {
                if (error) {
                    console.error('오디오 파일 로드 오류:', error);
                    resolve();
                    return;
                }

                const { isPlaying, playerKey = '' } = sound;

                sound.play(success => {
                    if (success) {
                        //console.log('성공적으로 재생되었습니다.');
                    } else {
                        console.error('재생 오류');
                    }
                    sound.release();
                    resolve(); // 다음 파일로 이동
                });
            });
        });
    };

    // 음성 출력 with Delay
    const playAudioWithDelay = (index, delay = 1000) => {
        const audioPath = audioPaths[index];
        return new Promise(resolve => {
            setTimeout(() => {
                const sound = new Sound(audioPath, '', error => {
                    if (error) {
                        console.error('오디오 파일 로드 오류:', error);
                        resolve();
                        return;
                    }

                    const { isPlaying, playerKey = '' } = sound;

                    sound.play(success => {
                        if (success) {
                            //console.log('성공적으로 재생되었습니다.');
                        } else {
                            console.error('재생 오류');
                        }
                        sound.release();
                        resolve();
                    });
                });
            }, delay);
        });
    };

    const playCountAudio = (index) => {
        const audioPath = countAudioPaths[index];
        return new Promise(resolve => {
            const sound = new Sound(audioPath, '', error => {
                if (error) {
                    console.error('카운트 오디오 파일 로드 오류:', error);
                    resolve();
                    return;
                }

                const { isPlaying, playerKey = '' } = sound;

                sound.play(success => {
                    if (success) {
                        //console.log('성공적으로 재생되었습니다.');
                    } else {
                        console.error('재생 오류');
                    }
                    sound.release();
                    resolve();
                });
            });
        });
    };

    const playCountAudioWithDelay = (index, delay = 1000) => {
        const audioPath = countAudioPaths[index];
        return new Promise(resolve => {
            setTimeout(() => {
                const sound = new Sound(audioPath, '', error => {
                    if (error) {
                        console.error('카운트 오디오 파일 로드 오류:', error);
                        resolve();
                        return;
                    }

                    const { isPlaying, playerKey = '' } = sound;

                    sound.play(success => {
                        if (success) {
                            //console.log('성공적으로 재생되었습니다.');
                        } else {
                            console.error('재생 오류');
                        }
                        sound.release();
                        resolve();
                    });
                });
            }, delay);
        });
    };

    // cameraVoice 음성 파일 관련 설정
    const [cameraVoicePaths, setCameraVoicePaths] = useState([]); // 음성 파일 경로 상태
    const [cameraVoiceData, setCameraVoiceData] = useState([]);   // 음성 파일 데이터 상태

    // cameraVoice 데이터 로드 (예제 데이터 설정)
    useEffect(() => {
        // cameraVoice 데이터의 길이에 따라 경로 생성
        const paths = cameraVoice.map((_, index) => `${RNFS.DocumentDirectoryPath}/camera_voice${index + 1}.wav`);
        setCameraVoicePaths(paths);
        setCameraVoiceData(cameraVoice);
    }, []);

    // cameraVoice 음성 파일 설정
    const setupCameraVoiceFiles = async () => {
        await Promise.all(
            cameraVoiceData.map(async (audioBytes, index) => {
                const path = cameraVoicePaths[index];
                // 기존 파일 삭제 (필요한 경우)
                if (await RNFS.exists(path)) {
                    await RNFS.unlink(path);
                }
                await RNFS.writeFile(path, audioBytes, 'base64'); // base64 데이터를 파일로 저장
            }),
        );
    };

    // cameraVoice 음성 파일 재생
    const playCameraVoice = (index) => {
        const audioPath = cameraVoicePaths[index];
        return new Promise((resolve) => {
            const sound = new Sound(audioPath, '', (error) => {
                if (error) {
                    console.error('카메라 음성 파일 로드 오류:', error);
                    resolve();
                    return;
                }

                const { isPlaying, playerKey = '' } = sound;

                sound.play((success) => {
                    if (success) {
                        console.log('카메라 음성 파일 재생 성공');
                    } else {
                        console.error('카메라 음성 파일 재생 오류');
                    }
                    sound.release();
                    resolve();
                });
            });
        });
    };

    // cameraVoice 음성 파일 재생 (지연 시간 포함)
    const playCameraVoiceWithDelay = (index, delay = 1000) => {
        const audioPath = cameraVoicePaths[index];
        return new Promise((resolve) => {
            setTimeout(() => {
                const sound = new Sound(audioPath, '', (error) => {
                    if (error) {
                        console.error('카메라 음성 파일 로드 오류:', error);
                        resolve();
                        return;
                    }

                    const { isPlaying, playerKey = '' } = sound;

                    sound.play((success) => {
                        if (success) {
                            console.log('카메라 음성 파일 재생 성공');
                        } else {
                            console.error('카메라 음성 파일 재생 오류');
                        }
                        sound.release();
                        resolve();
                    });
                });
            }, delay);
        });
    };

    // cameraVoice 설정 초기화
    useEffect(() => {
        setupCameraVoiceFiles()
            .then(() => console.log('카메라 음성 파일 준비 완료'))
            .catch((error) => console.error('카메라 음성 파일 설정 오류:', error));
    }, [cameraVoiceData]);

    useEffect(() => {
        setupCountAudioFiles()
            .then(() => console.log('카운트 오디오 파일 준비 완료'))
            .catch(error => console.error('카운트 오디오 파일 설정 오류:', error));
    }, [countAudioData]);

    // 음성 파일 로드 (비동기 함수이며, 1회만 동작함)
    useEffect(() => {
        // 컴포넌트가 마운트될 때 한 번만 음성 파일을 설정
        setupAudioFiles()
        .catch(error => console.error('오디오 파일 설정 오류:', error));
        playCameraVoice(0)
    }, [exerciseAudioData]);
    //export { setupExerciseAudioFiles, playAudio, playAudioWithDelay };

    // 0의 개수 확인을 통해 점수 계산
    const calculateFalsePercentage = (array) => {
        const falseCount = array.filter(value => value === 0).length;
        //console.log('calculateFalseCount:',falseCount)
        return Math.floor(100 * falseCount / array.length);
    };


    // 불리언 배열 상태
    // 최종 n회 전체에 대한 각각의 true or false를 저장
    const [booleansMoveArray, setBooleansMoveArray] = useState<number[]>([]);
    const [booleansStop1Array, setBooleansStop1Array] = useState<number[]>([]);
    const [booleansStop2Array, setBooleansStop2Array] = useState<number[]>([]);


    // 카메라 permission check
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

            playCameraVoice(0);
        };
        checkPermission();
    }, []);

    const [pitch, setPitch] = useState(0); // X축 기울기
    const [roll, setRoll] = useState(0); // Y축 기울기
    const [isPoseDetectionActive, setIsPoseDetectionActive] = useState(false); // Pose Detection 활성화 여부
    const pitchTimeRef = useRef(null); // Pitch가 70~90 사이에 유지된 시간 기록
    const notPitchTimeRef = useRef(null); // Pitch가 적정 각도 밖에서 유지된 시간 기록
    const isPitchStableRef = useRef(false); // Pitch 안정 상태 기록
    const isNotPitchStableRef = useRef(false); // Pitch 불안정 상태 기록
    const hasPlayedFinalVoice = useRef(false); // playCameraVoice(1) 실행 여부 추적

    // 각도를 라디안에서 도(degree)로 변환하는 함수
    const toDegrees = (radians) => {
        return radians * (180 / Math.PI);
    };

    useEffect(() => {
        // 가속도계 업데이트 간격 설정 (100ms)
        setUpdateIntervalForType(SensorTypes.accelerometer, 100);

        const subscription = accelerometer.subscribe(({ x, y, z }) => {
            if (hasPlayedFinalVoice.current) {
                return; // 이미 실행된 경우 다시 실행하지 않음
            }

            const rollAngle = toDegrees(Math.atan(y / Math.sqrt(x * x + z * z)));

            // roll 상태 업데이트
            if (Math.abs(roll - rollAngle) > 0.1) {
                setRoll(rollAngle.toFixed(2));
            }

            // roll 각도가 특정 범위 내에 있는지 확인 (예: 60도에서 90도 사이)
            if (rollAngle >= 60 && rollAngle <= 90) {
                if (!pitchTimeRef.current) {
                    pitchTimeRef.current = Date.now();
                }
                const elapsedTime = (Date.now() - pitchTimeRef.current) / 1000; // 초 단위
                if (elapsedTime >= 6 && !isPitchStableRef.current) {
                    isPitchStableRef.current = true;
                    //console.log("Roll 안정 상태 유지됨, Pose Detection 대기 중...");
                    playCameraVoice(1); // 첫 번째 카메라 음성 파일 재생
                    hasPlayedFinalVoice.current = true; // playCameraVoice(1) 실행 여부를 true로 설정

                    // 10초 대기 후 Pose Detection 활성화
                    setTimeout(() => {
                        setIsPoseDetectionActive(true);
                        //console.log("Pose Detection 활성화됨.");
                        playCameraVoice(3); // 최종 음성 파일 재생

                        // 여기에서 구독 해제
                        subscription.unsubscribe();
                    }, 10000);
                }
                notPitchTimeRef.current = null;
                isNotPitchStableRef.current = false;
            } else {
                if (!notPitchTimeRef.current) {
                    notPitchTimeRef.current = Date.now();
                }
                const elapsedTime_notPitch = (Date.now() - notPitchTimeRef.current) / 1000; // 초 단위
                if (elapsedTime_notPitch >= 6 && !isNotPitchStableRef.current) {
                    isNotPitchStableRef.current = true;
                    playCameraVoice(2); // 적정 각도가 아닌 상태에서 음성 파일 재생
                }
                // Roll이 범위를 벗어나면 초기화
                pitchTimeRef.current = null;
                isPitchStableRef.current = false;
            }
        });

        // 컴포넌트 언마운트 시 구독 해제
        return () => {
            subscription.unsubscribe();
        };
    }, [roll]);

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

    const FRAME_INTERVAL = 3; // Pose Detection을 실행할 프레임 간격
    const frameCounterRef = useRef(0); // 현재 프레임 카운터

    // 기존 frameProcessor에 활성화 여부 조건 추가
    const frameProcessor: DrawableFrameProcessor | ReadonlyFrameProcessor =
        useFrameProcessor((frame: Frame): void => {
            'worklet';
            if (!isPoseDetectionActive) return; // Pose Detection 비활성화 상태에서는 실행 안 함

            // 프레임 카운터 증가
            frameCounterRef.current += 1;

            // 지정된 프레임 간격에만 Pose Detection 실행
            if (frameCounterRef.current % FRAME_INTERVAL === 0) {
                const frameWidth = frame.width;
                const frameHeight = frame.height;
                const data: PoseType = detectPose(frame, {}); // Pose Detection 실행
                setPoseInJS({ pose: data, frameWidth, frameHeight }); // 데이터 전달
            }
        }, [isPoseDetectionActive]);

    useEffect(() => {
        if (!isTargetReached && pose) {
            const { frameWidth, frameHeight } = pose;

            // 선택된 운동에 따른 관절 세트 가져오기
            const jointSet = jointSets[exerciseType];
            if (!jointSet) {
                console.error('유효하지 않은 운동 유형입니다:', exerciseType);
                return;
            }

            // 렌더링 좌표와 동일하게 변환된 좌표를 생성
            const transformedPoints = {};
            Object.keys(pose.pose).forEach((key) => {
                transformedPoints[key] = convertToRenderedCoords(pose.pose[key], frameWidth, frameHeight);
            });

            // 각 운동에 따라 move, stop1, stop2에 해당하는 관절 좌표들로 각도 계산
            if (
                jointSet.move.every(key => transformedPoints[key]) &&
                jointSet.stop1.every(key => transformedPoints[key]) &&
                jointSet.stop2.every(key => transformedPoints[key])
            ) {
                if (Number(exerciseType) === 0){
                    moveAngle = calculateAngle(
                        transformedPoints[jointSet.move[0]],
                        transformedPoints[jointSet.move[1]],
                        transformedPoints[jointSet.move[2]]
                    );

                    stop1Angle = calculateAngle(
                        transformedPoints[jointSet.stop1[0]],
                        transformedPoints[jointSet.stop1[1]],
                        transformedPoints[jointSet.stop1[2]]
                    );

                    stop2Angle = calculateAngle(
                        transformedPoints[jointSet.stop2[0]],
                        transformedPoints[jointSet.stop2[1]],
                        transformedPoints[jointSet.stop2[2]]
                    );
                    lieAngle = calculateSlopeAngle(
                        transformedPoints[jointSet.lie[0]],
                        transformedPoints[jointSet.lie[1]]
                    );
                }
                else if (Number(exerciseType) === 8 || Number(exerciseType) === 9 || Number(exerciseType) === 10 || Number(exerciseType) === 11){
                    moveAngle = calculateAngle(
                        transformedPoints[jointSet.move[0]],
                        transformedPoints[jointSet.move[1]],
                        transformedPoints[jointSet.move[2]]
                    );

                    stop1Angle = calculateAngle(
                        transformedPoints[jointSet.stop1[0]],
                        transformedPoints[jointSet.stop1[1]],
                        transformedPoints[jointSet.stop1[2]]
                    );

                    stop2Angle = calculateSlopeAngle(
                        transformedPoints[jointSet.stop2[0]],
                        transformedPoints[jointSet.stop2[1]]
                    );
                    lieAngle = calculateSlopeAngle(
                        transformedPoints[jointSet.lie[0]],
                        transformedPoints[jointSet.lie[1]]
                    );
                }
                else {
                    moveAngle = calculateAngle(
                        transformedPoints[jointSet.move[0]],
                        transformedPoints[jointSet.move[1]],
                        transformedPoints[jointSet.move[2]]
                    );

                    stop1Angle = calculateAngle(
                        transformedPoints[jointSet.stop1[0]],
                        transformedPoints[jointSet.stop1[1]],
                        transformedPoints[jointSet.stop1[2]]
                    );

                    stop2Angle = calculateAngle(
                        transformedPoints[jointSet.stop2[0]],
                        transformedPoints[jointSet.stop2[1]],
                        transformedPoints[jointSet.stop2[2]]
                    );
                    lieAngle = calculateSlopeAngle(
                        transformedPoints[jointSet.lie[0]],
                        transformedPoints[jointSet.lie[1]]
                    );
                }


                if (
                    !detectOutlier(moveAngle, previousAngles.current.moveAngle) &&
                    !detectOutlier(stop1Angle, previousAngles.current.stop1Angle) &&
                    !detectOutlier(stop2Angle, previousAngles.current.stop2Angle)
                ) {
                    if (Number(exerciseType) === 0) {
                        updateStateofTutorial(moveAngle, stop1Angle, lieAngle, state, setState, setRepCount, booleans, setBooleans, exerciseType)
                    }

                    else if (Number(exerciseType) === 1 || Number(exerciseType) === 8 || Number(exerciseType) === 9
                    || Number(exerciseType) === 10 || Number(exerciseType) === 11) {
                        updateStateAndFeedback(moveAngle, stop1Angle, stop2Angle, lieAngle, state, setState, setRepCount, booleans, setBooleans, exerciseType, transformedPoints[jointSet.stop1[0]], transformedPoints[jointSet.stop1[2]]);
                    } else {
                        updateStateAndFeedbackwithTime(moveAngle, stop1Angle, stop2Angle, lieAngle, state, setState, setRepCount, booleans, setBooleans, exerciseType)

                    }
                    if ((state === 'finished') && !isTargetReached) {
                        setBooleansMoveArray(prev => {const updatedArray = [...prev, booleans.move ? 1 : 0];
                            return updatedArray;
                        });
                        setBooleansStop1Array(prev => {const updatedArray = [...prev, booleans.stop1 ? 1 : 0];
                            return updatedArray;
                        });
                        setBooleansStop2Array(prev => {const updatedArray = [...prev, booleans.stop2 ? 1 : 0];
                            return updatedArray;
                        });


                        playCountAudio(repCount-1);
                        const booleansArray = convertBooleansObjectToArray(booleans);
                        if (booleansArray.every((value, index) => value === [false, false, false][index])) {
                            playAudioWithDelay(0);
                            // 모든 값이 [false, false, false]와 동일할 때
                        } else if (booleansArray.every((value, index) => value === [true, false, false][index])) {
                            // 모든 값이 [true, false, false]와 동일할 때
                            playAudioWithDelay(1);
                        } else if (booleansArray.every((value, index) => value === [false, true, false][index])) {
                            // 모든 값이 [false, true, false]와 동일할 때
                            playAudioWithDelay(2);
                        } else if (booleansArray.every((value, index) => value === [false, false, true][index])) {
                            // 모든 값이 [false, false, true]와 동일할 때
                            playAudioWithDelay(3);
                        } else if (booleansArray.every((value, index) => value === [true, true, false][index])) {
                            // 모든 값이 [true, true, false]와 동일할 때
                            playAudioWithDelay(4);
                        } else if (booleansArray.every((value, index) => value === [true, false, true][index])) {
                            // 모든 값이 [true, false, true]와 동일할 때
                            playAudioWithDelay(5);
                        } else if (booleansArray.every((value, index) => value === [false, true, true][index])) {
                            // 모든 값이 [false, true, true]와 동일할 때
                            playAudioWithDelay(6);
                        }
                        else {
                            // 모든 값이 [true, true, true]와 동일할 때
                            playAudioWithDelay(7);
                        }
                        // 상태 초기화
                        setState('initial');
                        setBooleans({ move: true, stop1: false, stop2: false });
                    }
                }

                previousAngles.current = { moveAngle, stop1Angle, stop2Angle };
            }
        }
    }, [pose]);

    useEffect(() => {
        if (repCount >= targetRepCount && booleansMoveArray.length === targetRepCount && !isTargetReached) {
            console.log('목표 횟수에 도달했습니다.');

            const resultArray = [
                calculateFalsePercentage(booleansMoveArray),
                calculateFalsePercentage(booleansStop1Array),
                calculateFalsePercentage(booleansStop2Array)
            ];

            console.log('Result Array:', resultArray);

            // 페이지 이동 전에 isTargetReached 상태 업데이트
            setIsTargetReached(true);
            // 운동 id가 0이고 repCount가 3일 경우 Home으로 이동
            if (exerciseType === 0 && targetRepCount === 3) {
                setTimeout(() => {
                    setIsLoggedIn(true);
                }, 3000);
            } else {
                setTimeout(() => {
                    navigation.replace('HealthResult', { id: route.params?.id, resultArray, premium: route.params?.premium, isURL });
                }, 3000);
            }
        }
    }, [booleansMoveArray]);

    if (!hasPermission) {
        return <View><Text>카메라 권한을 허용한 뒤, 뒤로가기를 눌러주세요!</Text></View>;
    }

    if (!currentCamera) {
        return <View><Text>카메라 장치를 찾을 수 없습니다...</Text></View>;
    }

    const renderPoseDots = (id) => {
        if (!pose || !pose.frameWidth || !pose.frameHeight) return null;

        const { pose: poseData, frameWidth, frameHeight } = pose;

        // Set keys and connections based on the exercise id
        let keysToRender, connections;

        if (Number(id) === 1) { // push-up
            keysToRender = ['leftShoulderPosition', 'rightShoulderPosition',
                    'leftElbowPosition', 'rightElbowPosition', 'leftWristPosition', 'rightWristPosition',
                    'leftHipPosition', 'rightHipPosition', 'leftKneePosition', 'rightKneePosition',
                    'leftAnklePosition', 'rightAnklePosition'];
            connections = [
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
        } else if (Number(id) === 2) { // knee-push-up
            keysToRender = ['leftShoulderPosition', 'rightShoulderPosition',
                'leftElbowPosition', 'rightElbowPosition', 'leftWristPosition', 'rightWristPosition',
                'leftHipPosition', 'rightHipPosition', 'leftKneePosition', 'rightKneePosition',
                'leftAnklePosition', 'rightAnklePosition'];
            connections = [
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
        } else if (Number(id) === 3) { // pull-up
            keysToRender = ['leftShoulderPosition', 'rightShoulderPosition',
                'leftElbowPosition', 'rightElbowPosition', 'leftWristPosition', 'rightWristPosition',
                'leftHipPosition', 'rightHipPosition', 'leftKneePosition', 'rightKneePosition'
                ];
            connections = [
                ['leftShoulderPosition', 'rightShoulderPosition'],
                ['leftShoulderPosition', 'leftElbowPosition'],
                ['leftElbowPosition', 'leftWristPosition'],
                ['rightShoulderPosition', 'rightElbowPosition'],
                ['rightElbowPosition', 'rightWristPosition'],
                ['leftShoulderPosition', 'leftHipPosition'],
                ['rightShoulderPosition', 'rightHipPosition'],
                ['leftHipPosition', 'rightHipPosition'],
                ['leftHipPosition', 'leftKneePosition'],
                ['rightHipPosition', 'rightKneePosition']
            ];
        } else if (Number(id) === 4) { // pull-up ( band )
            keysToRender = ['leftShoulderPosition', 'rightShoulderPosition',
                'leftElbowPosition', 'rightElbowPosition', 'leftWristPosition', 'rightWristPosition',
                'leftHipPosition', 'rightHipPosition', 'leftKneePosition', 'rightKneePosition'
                ];
            connections = [
                ['leftShoulderPosition', 'rightShoulderPosition'],
                ['leftShoulderPosition', 'leftElbowPosition'],
                ['leftElbowPosition', 'leftWristPosition'],
                ['rightShoulderPosition', 'rightElbowPosition'],
                ['rightElbowPosition', 'rightWristPosition'],
                ['leftShoulderPosition', 'leftHipPosition'],
                ['rightShoulderPosition', 'rightHipPosition'],
                ['leftHipPosition', 'rightHipPosition'],
                ['leftHipPosition', 'leftKneePosition'],
                ['rightHipPosition', 'rightKneePosition']
            ];
        } else if (Number(id) === 5) { // sit-up
            keysToRender = ['nosePosition', 'leftEarPosition', 'rightEarPosition',
                'leftShoulderPosition', 'rightShoulderPosition',
                'leftElbowPosition', 'rightElbowPosition', 'leftWristPosition', 'rightWristPosition',
                'leftHipPosition', 'rightHipPosition', 'leftKneePosition', 'rightKneePosition',
                'leftAnklePosition', 'rightAnklePosition'];
            connections = [
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
        } else if (Number(id) === 6) { // leg-raise
            keysToRender = ['leftShoulderPosition', 'rightShoulderPosition',
                'leftHipPosition', 'rightHipPosition', 'leftKneePosition', 'rightKneePosition',
                'leftAnklePosition', 'rightAnklePosition'];
            connections = [
                ['leftShoulderPosition', 'rightShoulderPosition'],
                ['leftShoulderPosition', 'leftHipPosition'],
                ['rightShoulderPosition', 'rightHipPosition'],
                ['leftHipPosition', 'rightHipPosition'],
                ['leftHipPosition', 'leftKneePosition'],
                ['leftKneePosition', 'leftAnklePosition'],
                ['rightHipPosition', 'rightKneePosition'],
                ['rightKneePosition', 'rightAnklePosition']
            ];
        } else if (Number(id) === 7) { // hanging - leg -raise
            keysToRender = ['leftShoulderPosition', 'rightShoulderPosition',
                'leftElbowPosition', 'rightElbowPosition', 'leftWristPosition', 'rightWristPosition',
                'leftHipPosition', 'rightHipPosition', 'leftKneePosition', 'rightKneePosition',
                'leftAnklePosition', 'rightAnklePosition'];
            connections = [
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
        } else if (Number(id) === 8) { // squat
            keysToRender = ['leftShoulderPosition', 'rightShoulderPosition',
                'leftElbowPosition', 'rightElbowPosition', 'leftWristPosition', 'rightWristPosition',
                'leftHipPosition', 'rightHipPosition', 'leftKneePosition', 'rightKneePosition',
                'leftAnklePosition', 'rightAnklePosition','leftHeelPosition', 'rightHeelPosition',
                'leftFootIndexPosition','rightFootIndexPosition'];
            connections = [
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
                ['leftAnklePosition', 'leftFootIndexPosition'],
                ['leftAnklePosition', 'leftHeelPosition'],
                ['leftHeelPosition', 'leftFootIndexPosition'],
                ['rightAnklePosition', 'rightFootIndexPosition'],
                ['rightAnklePosition', 'rightHeelPosition'],
                ['rightHeelPosition', 'rightFootIndexPosition']
            ];
        } else if (Number(id) === 9) { // one-leg squat
            keysToRender = ['leftShoulderPosition', 'rightShoulderPosition',
                'leftElbowPosition', 'rightElbowPosition', 'leftWristPosition', 'rightWristPosition',
                'leftHipPosition', 'rightHipPosition', 'leftKneePosition', 'rightKneePosition',
                'leftAnklePosition', 'rightAnklePosition','leftHeelPosition', 'rightHeelPosition',
                'leftFootIndexPosition','rightFootIndexPosition'];
            connections = [
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
                ['leftAnklePosition', 'leftFootIndexPosition'],
                ['leftAnklePosition', 'leftHeelPosition'],
                ['leftHeelPosition', 'leftFootIndexPosition'],
                ['rightAnklePosition', 'rightFootIndexPosition'],
                ['rightAnklePosition', 'rightHeelPosition'],
                ['rightHeelPosition', 'rightFootIndexPosition']
            ];
        } else if (Number(id) === 10) { // lunge
            keysToRender = [
                'leftHipPosition', 'rightHipPosition', 'leftKneePosition', 'rightKneePosition',
                'leftAnklePosition', 'rightAnklePosition','leftHeelPosition', 'rightHeelPosition',
                'leftFootIndexPosition','rightFootIndexPosition'];
            connections = [
                ['leftHipPosition', 'rightHipPosition'],
                ['leftHipPosition', 'leftKneePosition'],
                ['leftKneePosition', 'leftAnklePosition'],
                ['rightHipPosition', 'rightKneePosition'],
                ['rightKneePosition', 'rightAnklePosition'],
                ['leftAnklePosition', 'leftFootIndexPosition'],
                ['leftAnklePosition', 'leftHeelPosition'],
                ['leftHeelPosition', 'leftFootIndexPosition'],
                ['rightAnklePosition', 'rightFootIndexPosition'],
                ['rightAnklePosition', 'rightHeelPosition'],
                ['rightHeelPosition', 'rightFootIndexPosition']
            ];
        } else if (Number(id) === 11) { // 카프레이즈
            keysToRender = [
                'leftHipPosition', 'rightHipPosition', 'leftKneePosition', 'rightKneePosition',
                'leftAnklePosition', 'rightAnklePosition','leftHeelPosition', 'rightHeelPosition',
                'leftFootIndexPosition','rightFootIndexPosition'];
            connections = [
                ['leftHipPosition', 'rightHipPosition'],
                ['leftHipPosition', 'leftKneePosition'],
                ['leftKneePosition', 'leftAnklePosition'],
                ['rightHipPosition', 'rightKneePosition'],
                ['rightKneePosition', 'rightAnklePosition'],
                ['leftAnklePosition', 'leftFootIndexPosition'],
                ['leftAnklePosition', 'leftHeelPosition'],
                ['leftHeelPosition', 'leftFootIndexPosition'],
                ['rightAnklePosition', 'rightFootIndexPosition'],
                ['rightAnklePosition', 'rightHeelPosition'],
                ['rightHeelPosition', 'rightFootIndexPosition']
            ];
        } else if (Number(id) === 12) { // hip - thrust
            keysToRender = ['leftShoulderPosition', 'rightShoulderPosition',
                'leftHipPosition', 'rightHipPosition', 'leftKneePosition', 'rightKneePosition',
                'leftAnklePosition', 'rightAnklePosition'];
            connections = [
                ['leftShoulderPosition', 'rightShoulderPosition'],
                ['leftShoulderPosition', 'leftHipPosition'],
                ['rightShoulderPosition', 'rightHipPosition'],
                ['leftHipPosition', 'rightHipPosition'],
                ['leftHipPosition', 'leftKneePosition'],
                ['leftKneePosition', 'leftAnklePosition'],
                ['rightHipPosition', 'rightKneePosition'],
                ['rightKneePosition', 'rightAnklePosition']
            ];
        }
        else {
                keysToRender = [
                    'nosePosition', 'leftEarPosition', 'rightEarPosition', 'leftShoulderPosition', 'rightShoulderPosition',
                    'leftElbowPosition', 'rightElbowPosition', 'leftWristPosition', 'rightWristPosition',
                    'leftHipPosition', 'rightHipPosition', 'leftKneePosition', 'rightKneePosition',
                    'leftAnklePosition', 'rightAnklePosition'
                ];
                connections = [
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
        }

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
            {renderPoseDots(route.params.id)}
            <NumContainer >
                <NumText>
                    {repCount}
                </NumText>
            </NumContainer>
            <CameraIcon onPress={() => setUseFrontCamera(!useFrontCamera)}>
                <CameraImage source={require('../assets/images/uil_camera-change.png')} />
            </CameraIcon>
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