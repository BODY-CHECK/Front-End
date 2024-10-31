import React from 'react';
import axios from 'axios';
import {Alert, StyleSheet, View} from 'react-native';
import LoginFooter from '../components/login/LoginFooter';
import LoginForm from '../components/login/LoginForm';
import LoginHeader from '../components/login/LoginHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../AuthContext';

const baseURL = 'https://dev.bodycheck.store'; // 서버 주소

function Login() {
  const {setIsLoggedIn} = useAuth();

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${baseURL}/members/email/sign-in`, {
        email: email,
        pw: password,
      });

      if (response.data.isSuccess) {
        const {accessToken, refreshToken} = response.data.result;

        // 토큰 저장
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);

        setIsLoggedIn(true); // 로그인 성공 시 상태 업데이트
        Alert.alert('로그인 성공', response.data.message);
      } else {
        Alert.alert(
          '로그인 실패',
          response.data.message || '다시 시도해주세요.',
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        '로그인 실패',
        error.response?.data?.message ||
          '서버와의 통신 중 문제가 발생했습니다.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <LoginHeader />
      <LoginForm onLogin={handleLogin} />
      <LoginFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

export default Login;
