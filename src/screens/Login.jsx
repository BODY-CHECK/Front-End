import React, {useState} from 'react';
import axios from 'axios';
import {Alert, StyleSheet, View} from 'react-native';
import LoginFooter from '../components/login/LoginFooter';
import LoginForm from '../components/login/LoginForm';
import LoginHeader from '../components/login/LoginHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../AuthContext';
import ConfirmModal from '../components/ConfirmModal';

const baseURL = 'https://dev.bodycheck.store'; // 서버 주소

function Login() {
  const {setIsLoggedIn} = useAuth();
  const [confirmModalVisible, setConirmModalVisible] = useState(false); // 모달 상태
  const [confirmModalMessage, setConfirmModalMessage] = useState(''); // 모달 메시지

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
      } else {
        setConirmModalVisible(true);
        setConfirmModalMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setConirmModalVisible(true);
      setConfirmModalMessage(error.response?.data?.message);
    }
  };

  return (
    <View style={styles.container}>
      <LoginHeader />
      <LoginForm onLogin={handleLogin} />
      <LoginFooter />
      <ConfirmModal
        visible={confirmModalVisible}
        message={confirmModalMessage}
        onConfirm={() => setConirmModalVisible(false)}
      />
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
