// AuthContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useState, useContext, useEffect} from 'react';
import instance from './axiosInstance';
import {Alert, AppState} from 'react-native';

const baseURL = 'https://dev.bodycheck.store'; // 서버 주소

const AuthContext = createContext();

export function AuthProvider({children}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 앱 초기화 상태

  // 로그아웃 함수
  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
  };

  // 토큰 확인 및 로그인 상태 초기화
  const initializeAuth = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (accessToken) {
        // 토큰이 유효하면 로그인 상태 유지
        setIsLoggedIn(true);
      } else if (refreshToken) {
        // AccessToken이 없고 RefreshToken만 있다면 갱신 시도
        const response = await instance.post('/members/refresh-token', {
          refreshToken,
        });

        if (response.data.isSuccess) {
          const {accessToken: newAccessToken, refreshToken: newRefreshToken} =
            response.data.result;

          await AsyncStorage.setItem('accessToken', newAccessToken);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);
          setIsLoggedIn(true);
        } else {
          // 갱신 실패 시 로그아웃
          await logout();
        }
      } else {
        // 둘 다 없으면 비로그인 상태
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('초기화 중 오류 발생:', error);
      await logout(); // 오류 발생 시 로그아웃 처리
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  // 포그라운드 전환 시 토큰 확인 및 갱신
  useEffect(() => {
    initializeAuth();

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

  if (isLoading) {
    // 로딩 화면을 보여줌 (스플래시 화면 등)
    return null;
  }

  return (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
