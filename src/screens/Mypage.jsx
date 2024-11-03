import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import MypageHeader from '../components/mypage/MypageHeader';
import MyCalendar from '../components/mypage/MyCalendar';
import BMIGraph from '../components/mypage/BMIGraph';
import ToSolutionButton from '../components/mypage/ToSoulutionButton';
import instance from '../axiosInstance';
import {Alert, Button, Linking} from 'react-native';
import {useAuth} from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Link} from '@react-navigation/native';

const baseURL = 'https://dev.bodycheck.store';

function MyPage() {
  const handleOpenUrl = () => {
    const tempUrl =
      'https://online-payment.kakaopay.com/mockup/bridge/mobile-app/pg/subscription/payment-issue/457a734531443315ba72deb81d9c7a8fc0d941cbe9a6cbca082d1f67bc4332ed'; // 임시 URL 설정
    Linking.openURL(tempUrl);
  };
  const [nickname, setNickname] = useState('');
  const {setIsLoggedIn} = useAuth();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      setIsLoggedIn(false); // 로그아웃 상태로 전환
      Alert.alert('로그아웃 되었습니다.');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        // 서버에서 사용자 정보 가져오기
        const response = await instance.get(`${baseURL}/members/my-page`); // 해당 엔드포인트로 변경
        if (response.data.isSuccess) {
          setNickname(response.data.result.nickname); // 닉네임 저장
        } else {
          console.error('닉네임을 가져오지 못했습니다.');
        }
      } catch (error) {
        console.error('닉네임 가져오기 오류:', error);
      }
    };
    fetchNickname();
  }, []);

  return (
    <>
      <Container>
        <Button title="버튼" onPress={handleOpenUrl}>
          버튼
        </Button>
        <Button title="로그아웃" onPress={handleLogout}>
          로그아웃
        </Button>
        <MypageHeader nickname={nickname} />
        <MyCalendar />
        <BMIGraph />
      </Container>
      <ToSolutionButton />
    </>
  );
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #fff;
  padding: 20px;
`;

export default MyPage;
