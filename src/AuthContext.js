// AuthContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useState, useContext, useEffect} from 'react';
import instance from './axiosInstance';
import {Alert, AppState} from 'react-native';

const baseURL = 'https://dev.bodycheck.store'; // 서버 주소

const AuthContext = createContext();

export function AuthProvider({children}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그아웃 함수
  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    Alert.alert('다시 로그인해주세요');
  };

  // 액세스 토큰 새로고침 함수
  const refreshAccessToken = async () => {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const refreshResponse = await instance.post(
          `${baseURL}/members/refresh-token`,
          {refreshToken},
        );
        if (refreshResponse.data.isSuccess) {
          const {accessToken} = refreshResponse.data.result;
          await AsyncStorage.setItem('accessToken', accessToken);
          setIsLoggedIn(true); // 로그인 상태 설정
        } else {
          await logout();
        }
      } catch (error) {
        console.error('토큰 갱신 오류:', error);
        await logout();
      }
    }
  };

  // 포그라운드 전환 시 토큰 확인 및 갱신
  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      if (nextAppState === 'active') {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) {
          await refreshAccessToken(); // 액세스 토큰 갱신
        } else {
          setIsLoggedIn(true);
        }
      }
    };

    // 앱 상태 변화 감지
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => subscription.remove();
  }, []);

  return (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
