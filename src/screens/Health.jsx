import {View, Text, StyleSheet, Linking} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import { Button, ButtonText, CameraIcon, CameraImage, Container, NumContainer, NumText } from './Health.style';

export default function Health() {
  const route = useRoute();
  const {id} = route.params;
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const devices = useCameraDevices();
  // 후면 카메라 하나 선택 (첫 번째 후면 카메라)
  const backCamera = devices?.find(device => device.position === 'back');

  // 전면 카메라 하나 선택 (첫 번째 전면 카메라)
  const frontCamera = devices?.find(device => device.position === 'front');
  console.log(devices);

  useFocusEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });

    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  });

  useEffect(() => {
    const checkPermission = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      console.log('현재 카메라 권한 상태:', cameraPermission);

      switch (cameraPermission) {
        case 'authorized':
        case 'granted':
          setHasPermission(true); // 권한이 있을 때 카메라 활성화
          break;

        case 'not-determined':
          const newCameraPermission = await Camera.requestCameraPermission();
          console.log('새로운 카메라 권한 상태:', newCameraPermission);
          if (newCameraPermission === 'authorized' || newCameraPermission === 'granted') {
            setHasPermission(true); // 권한이 승인되면 카메라 활성화
          } else if (newCameraPermission === 'denied') {
            await Linking.openSettings();
          }
          break;

        case 'denied':
          await Linking.openSettings();
          break;
      }
    };

    checkPermission();
  }, []);

  if (!hasPermission) {
    // 권한이 없거나 아직 확인 중인 경우 로딩 화면 또는 안내 메시지 표시
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

  const currentCamera = useFrontCamera ? frontCamera : backCamera;

  return (
    <Container>
      <Camera
        style={StyleSheet.absoluteFill}
        device={currentCamera}
      photo={true}
      video={false}
      audio={false} // 선택사항
      isActive={true}
    />
      <NumContainer>
        <NumText>3</NumText>
      </NumContainer>
      <CameraIcon onPress={() => setUseFrontCamera(!useFrontCamera)}>
        <CameraImage source={require('../assets/images/uil_camera-change.png')}/>
      </CameraIcon>
      <Button onPress={() => navigation.navigate('HealthResult', {id})}>
        <ButtonText>다음 화면(임시 버튼)</ButtonText>
      </Button>
    </Container>
  );
}
