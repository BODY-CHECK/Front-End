// AuthContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useState, useContext, useEffect} from 'react';

const AuthContext = createContext();

export function AuthProvider({children}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 앱 로드 시 토큰이 있는지 확인하여 로그인 상태 복원
  useEffect(() => {
    const checkToken = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        setIsLoggedIn(true); // 토큰이 있으면 로그인 상태 설정
      }
    };
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
