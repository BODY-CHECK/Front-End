import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import LoginHeader from '../components/login/LoginHeader';
import LoginForm from '../components/login/LoginForm';
import LoginFooter from '../components/login/LoginFooter';

function Login({setIsLoggedIn}) {
  const handleLogin = (id, password) => {
    // 간단한 로그인 로직
    if (id === 'user' && password === 'password') {
      setIsLoggedIn(true); // 로그인 성공 시 상태 업데이트
    } else {
      Alert.alert('로그인 실패', '아이디 또는 비밀번호가 잘못되었습니다.');
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
    padding: 16,
    backgroundColor: 'white',
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
