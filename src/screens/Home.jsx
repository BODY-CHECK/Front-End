import React from 'react';
import styled from 'styled-components';
import TitlewithBtn from '../components/TitlewithBtn';
import RoutineBox from '../components/home/RoutineBox';
import AIptBox from '../components/home/AIptBox';
import {useNavigation} from '@react-navigation/native';

function Home() {
  const nav = useNavigation();

  const handleClickRoutine = () => {
    nav.navigate('운동 루틴');
  };

  const handleClickAI = () => {
    nav.navigate('AI 피티');
  };

  return (
    <Container>
      <TitlewithBtn
        title="MY 루틴"
        buttonText="설정하기>"
        onPress={handleClickRoutine}
      />
      <RoutineBox />
      <TitlewithBtn
        title="AI 피티"
        buttonText="전체보기>"
        onPress={handleClickAI}
      />
      <AIptBox />
    </Container>
  );
}

export default Home;

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #fff;
  padding: 20px;
`;
