import React, {useRef, useState} from 'react';
import styled from 'styled-components/native';
import TitlewithBtn from '../components/TitlewithBtn';
import DaySelector from '../components/routine/DaySelector';
import RoutineBox from '../components/routine/RoutineBox';
import ExerciseListBottomSheet from '../components/routine/ExerciseListBottomSheet';
import ExerciseCard from '../components/routine/ExerciseCard';

function Routine() {
  const [selectedDay, setSelectedDay] = useState('월'); // 선택된 요일을 관리하는 state
  const [routines, setRoutines] = useState({
    월: [null, null, null],
    화: [null, null, null],
    수: [null, null, null],
    목: [null, null, null],
    금: [null, null, null],
    토: [null, null, null],
    일: [null, null, null],
  }); //각 요일별 3개의 운동 저장
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null); // 어떤 인덱스의 플러스 버튼이 눌렸는지 기억
  const sheetRef = useRef(null);

  const handlePlusClick = index => {
    setSelectedIndex(index); // 클릭한 인덱스 저장
    if (sheetRef.current) {
      sheetRef.current.expand(); // BottomSheet를 여는 함수
    } else {
      console.log('BottomSheet reference is null');
    }
  };

  // 바텀 시트에서 운동을 선택하면 해당 요일의 루틴에 선택한 운동을 설정
  const handleExerciseSelect = exercise => {
    setRoutines(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((item, idx) =>
        idx === selectedIndex ? exercise : item,
      ),
    }));
    sheetRef.current?.close();
  };

  // 운동을 삭제하는 함수 (X 버튼 클릭 시 호출)
  const handleDeleteExercise = index => {
    setRoutines(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((item, idx) =>
        idx === index ? null : item,
      ),
    }));
  };

  // 설정하기/저장하기 버튼 클릭 시 호출
  const toggleEditing = () => {
    setIsEditing(!isEditing); // 설정 모드와 저장 모드 전환
  };

  return (
    <Container>
      <TitlewithBtn
        title="MY 루틴"
        buttonText={isEditing ? '저장하기>' : '설정하기>'}
        onPress={toggleEditing}
      />
      <DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />
      <RoutineBox
        routines={routines[selectedDay]}
        onPlusClick={handlePlusClick}
        isEditing={isEditing}
        onDelete={handleDeleteExercise}
      />
      <ExerciseCard />
      <ExerciseListBottomSheet
        sheetRef={sheetRef}
        onSelect={handleExerciseSelect}
      />
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
