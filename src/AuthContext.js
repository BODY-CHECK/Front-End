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
  };

  // 포그라운드 전환 시 토큰 확인 및 갱신
  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      if (nextAppState === 'active') {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (!accessToken && refreshToken) {
          // 로그인 시도 시 `axiosInstance.js`가 자동 갱신하도록 대기
          setIsLoggedIn(true);
        } else if (!accessToken && !refreshToken) {
          setIsLoggedIn(false);
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
