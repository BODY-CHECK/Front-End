import React from 'react';
import styled from 'styled-components';
import MypageHeader from '../components/mypage/MypageHeader';
import MyCalendar from '../components/mypage/MyCalendar';
import BMIGraph from '../components/mypage/BMIGraph';
import ToSolutionButton from '../components/mypage/ToSoulutionButton';

function MyPage() {
  return (
    <>
      <Container>
        <MypageHeader />
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
