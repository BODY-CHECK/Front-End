import React, {useRef, useState} from 'react';
import styled from 'styled-components/native';
import TitlewithBtn from '../components/TitlewithBtn';
import DaySelector from '../components/routine/DaySelector';
import RoutineBox from '../components/routine/RoutineBox';
import ExerciseListBottomSheet from '../components/routine/ExerciseListBottomSheet';

function Routine() {
  const [selectedDay, setSelectedDay] = useState('월'); // 선택된 요일을 관리하는 state
  const sheetRef = useRef(null);

  const handlePlusClick = () => {
    if (sheetRef.current) {
      sheetRef.current.snapTo(0); // BottomSheet를 열도록 설정
    } else {
      console.log('BottomSheet reference is null');
    }
  };

  return (
    <Container>
      <TitlewithBtn title="MY 루틴" buttonText="설정하기>" />
      <DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />
      <RoutineBox onPlusClick={handlePlusClick} />
      <ExerciseListBottomSheet sheetRef={sheetRef} />
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
