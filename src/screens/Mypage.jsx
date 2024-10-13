import React from 'react';
import styled from 'styled-components';
import MypageHeader from '../components/mypage/MypageHeader';
import MyCalendar from '../components/mypage/MyCalendar';
import BMIGraph from '../components/mypage/BMIGraph';

function MyPage() {
  return (
    <Container>
      <MypageHeader />
      <MyCalendar />
      <BMIGraph />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #fff;
  padding: 20px;
`;

export default MyPage;
