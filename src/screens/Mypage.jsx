import React from 'react';
import styled from 'styled-components';
import MypageHeader from '../components/mypage/MypageHeader';
import MyCalendar from '../components/mypage/MyCalendar';

function MyPage() {
  return (
    <Container>
      <MypageHeader />
      <MyCalendar />
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
