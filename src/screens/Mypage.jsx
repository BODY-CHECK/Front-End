import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import instance from '../axiosInstance';
import BMIGraph from '../components/mypage/BMIGraph';
import MyCalendar from '../components/mypage/MyCalendar';
import MypageHeader from '../components/mypage/MypageHeader';
import ToSolutionButton from '../components/mypage/ToSoulutionButton';

const baseURL = 'https://dev.bodycheck.store';

function MyPage() {
  const [nickname, setNickname] = useState('');

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
    <ScrollContainer>
      <Container>
        <MypageHeader nickname={nickname} />
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
