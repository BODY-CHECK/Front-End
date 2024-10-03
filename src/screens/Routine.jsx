import React, {useState} from 'react';
import styled from 'styled-components/native';
import TitlewithBtn from '../components/TitlewithBtn';
import RoutineBox from '../components/home/RoutineBox';
import DaySelector from '../components/routine/DaySelector';
import ExerciseCard from '../components/routine/ExerciseCard';

function Routine() {
  const [selectedDay, setSelectedDay] = useState('월'); // 선택된 요일을 관리하는 state

  return (
    <Container>
      <TitlewithBtn title="MY 루틴" buttonText="설정하기>" />
      <DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />
      <RoutineBox />
      <ExerciseCard />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #fff;
  padding: 20px;
`;

export default Routine;
