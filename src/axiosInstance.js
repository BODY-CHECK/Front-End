// axiosInstance.js

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {useAuth} from './AuthContext';

const baseURL = 'https://dev.bodycheck.store'; // 서버 주소
const instance = axios.create({
  baseURL,
});

// 로그아웃 함수
const logout = async () => {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
  const auth = useAuth();
  auth.setIsLoggedIn(false);
  Alert.alert('다시 로그인해주세요');
};

// 액세스 토큰 갱신 함수
const refreshAccessToken = async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  if (!refreshToken) {
    await logout();
    return null;
  }

  try {
    console.log('Attempting to refresh access token...');
    const refreshResponse = await axios.post(
      `${baseURL}/members/refresh-token`,
      {refreshToken},
    );
    if (refreshResponse.data.isSuccess) {
      const {accessToken, refreshToken: newRefreshToken} =
        refreshResponse.data.result;
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', newRefreshToken); // 새 리프레시 토큰 저장
      console.log('Access token refreshed successfully:', accessToken);
      console.log('refresh token refreshed successfully.', newRefreshToken);
      return accessToken;
    } else {
      console.log('Failed to refresh token:', refreshResponse.data.message);
      await logout();
      return null;
    }
  } catch (error) {
    console.error('토큰 갱신 오류:', error);
    await logout();
    return null;
  }
};

// 요청 인터셉터: 모든 요청에 access token을 추가
instance.interceptors.request.use(async config => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터: 401 오류 시 refresh token으로 액세스 토큰 갱신 후 재요청
instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 401 또는 500 에러가 발생하면 토큰을 갱신하고 재시도
    if (error.response?.status === 401 || error.response?.status === 500) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        // 새 액세스 토큰을 헤더에 추가하고 요청을 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
