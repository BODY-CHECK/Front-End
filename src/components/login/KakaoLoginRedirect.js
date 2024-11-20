// KakaoLoginRedirect.js
import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Text,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../../AuthContext';

const baseURL = 'https://dev.bodycheck.store';

const KakaoLoginRedirect = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {setIsLoggedIn} = useAuth(); // setIsLoggedIn 가져오기
  const code = route.params?.token;

  useEffect(() => {
    if (code) {
      handleKakaoLogin();
    } else {
      Alert.alert('오류', '인가 코드가 없습니다.');
      navigation.navigate('Login'); // 인가 코드가 없으면 로그인 화면으로 돌아가기
    }
  }, [code]);

  const handleKakaoLogin = async () => {
    try {
      // 백엔드 서버에 인가 코드를 전달하여 로그인 요청
      const response = await axios.get(
        `${baseURL}/login/oauth2/code/kakao?code=${code}`,
      );

      if (response.data.isSuccess) {
        const {user, email, accessToken, refreshToken} = response.data.result;

        if (user) {
          // 로그인 성공 시 홈 화면으로 이동
          console.log('로그인 성공:', response.data);
          // accessToken을 AsyncStorage에 저장 (토큰 관리)
          await AsyncStorage.setItem('accessToken', accessToken);
          await AsyncStorage.setItem('refreshToken', refreshToken);
          setIsLoggedIn(true); // 로그인 상태 업데이트
        } else {
          // user가 false인 경우: 회원가입 필요, 이메일을 회원가입 화면에 전달
          console.log('회원가입이 필요한 계정:', email);
          navigation.navigate('SignupSocial', {email});
        }
      } else {
        console.log('로그인 실패:', response.data);
        // 로그인 실패 시 경고 메시지 표시
        Alert.alert(
          '로그인 실패',
          response.data.message || '알 수 없는 오류가 발생했습니다.',
        );
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Kakao login error:', error.response || error);
      Alert.alert(
        '서버 오류',
        `로그인 중 오류가 발생했습니다. 상태 코드: ${
          error.response?.status
        }\n메시지: ${error.response?.data?.message || error.message}`,
      );
      navigation.navigate('Login'); // 오류 발생 시 로그인 화면으로 돌아가기
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>카카오 로그인 처리 중...</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default KakaoLoginRedirect;
