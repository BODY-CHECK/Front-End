// axiosInstance.js

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const baseURL = 'https://dev.bodycheck.store'; // 서버 주소
const instance = axios.create({
  baseURL,
});

// 요청 인터셉터: 모든 요청에 access token을 추가
instance.interceptors.request.use(async config => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터: access token 만료 시 refresh token으로 갱신
instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 한 번만 재시도하도록 플래그 설정
      originalRequest._retry = true;

      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(
            `${baseURL}/members/refresh-token`,
            {
              refreshToken,
            },
          );

          if (refreshResponse.data.isSuccess) {
            const {accessToken} = refreshResponse.data.result;
            await AsyncStorage.setItem('accessToken', accessToken);

            // 새로운 access token으로 재요청
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return instance(originalRequest); // 재요청
          } else {
            // 토큰 재발급 실패 시 로그아웃 처리
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            Alert.alert('다시 로그인해주세요');
          }
        } catch (refreshError) {
          console.error('토큰 갱신 오류:', refreshError);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
