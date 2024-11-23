import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import instance from '../axiosInstance';
import BMIGraph from '../components/mypage/BMIGraph';
import MyCalendar from '../components/mypage/MyCalendar';
import MypageHeader from '../components/mypage/MypageHeader';
import ToSolutionButton from '../components/mypage/ToSoulutionButton';
import {useFocusEffect} from '@react-navigation/native';

const baseURL = 'https://dev.bodycheck.store';

function MyPage() {
  const [nickname, setNickname] = useState('');
  const [premium, setPremium] = useState(false);

  // 화면이 포커스될 때 닉네임 가져오기
  useFocusEffect(
    useCallback(() => {
      const fetchNickname = async () => {
        try {
          const response = await instance.get(`${baseURL}/members/my-page`);
          if (response.data.isSuccess) {
            setNickname(response.data.result.nickname);
            setPremium(response.data.result.premium); // 프리미엄 상태 설정
          } else {
            console.error('닉네임을 가져오지 못했습니다.');
          }
        } catch (error) {
          console.error('닉네임 가져오기 오류:', error);
        }
      };
      fetchNickname();
    }, []),
  );

  return (
    <ScrollContainer>
      <Container>
        <MypageHeader nickname={nickname} premium={premium} />
        <MyCalendar />
        <BMIGraph />
      </Container>
      <ToSolutionButton />
    </ScrollContainer>
  );
}

const ScrollContainer = styled.ScrollView`
  flex: 1;
  background-color: #fff;
`;
const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #fff;
  padding: 20px;
`;

export default MyPage;
