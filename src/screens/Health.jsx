import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Linking, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Camera as VisionCamera, useCameraDevices, useFrameProcessor, useSkiaFrameProcessor } from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core';
import Svg, { Circle } from 'react-native-svg';
import { Button, ButtonText, CameraIcon, CameraImage, Container, NumContainer, NumText } from './Health.style';
import { detectPose } from './detectPose';

export default function Health() {
  const route = useRoute();
  const { id } = route.params;
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const [pose, setPose] = useState(null);
  const cameraRef = useRef(null);

  const devices = useCameraDevices();
  const backCamera = devices?.find(device => device.position === 'back');
  const frontCamera = devices?.find(device => device.position === 'front');
  const currentCamera = useFrontCamera ? frontCamera : backCamera;

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

  const setPoseInJS = Worklets.createRunOnJS((newPose) => {
    if (JSON.stringify(newPose) !== JSON.stringify(pose)) {
      setPose(newPose);
    }
  });

  const frameProcessor = useCallback(
    useFrameProcessor((frame) => {
      'worklet';
      //frame.render()
      const data = detectPose(frame, { mode: 'stream', performanceMode: 'max' });
      setPoseInJS(data);
    }, []),
    []
  );

  if (!hasPermission) {
    return (
      <View>
        <Text>카메라 권한을 확인 중입니다...</Text>
      </View>
    );
  }

  if (!backCamera || !frontCamera) {
    return (
      <View>
        <Text>카메라 장치를 찾을 수 없습니다...</Text>
      </View>
    );
  }
  const renderPoseDots = () => {
    if (!pose) return null;
    return (
      <Svg style={StyleSheet.absoluteFill}>
        {Object.keys(pose).map((key) => {
          const point = pose[key];
          const x = screenWidth - (point.x -30);
          const y = point.y + 70;

          return (
            <Circle
              key={`${key}-circle`}
              cx={x}
              cy={y}
              r={5}
              fill="red"
            />
          );
        })}
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
        photo={false}
        video={false}
        audio={false}
        frameProcessor={frameProcessor} 
      />
      <NumContainer>
        <NumText>3</NumText>
      </NumContainer>
      <CameraIcon onPress={() => setUseFrontCamera(!useFrontCamera)}>
        <CameraImage source={require('../assets/images/uil_camera-change.png')} />
      </CameraIcon>
      <Button onPress={() => navigation.navigate('HealthResult', { id })}>
        <ButtonText>다음 화면(임시 버튼)</ButtonText>
      </Button>
      {renderPoseDots()}
    </Container>
  );
}

const styles = StyleSheet.create({
  poseContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    maxHeight: 200,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  poseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  poseKey: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  poseValue: {
    color: 'white',
    fontSize: 12,
  },
});