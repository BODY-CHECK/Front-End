import React, {useEffect, useRef, useState} from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
import instance from '../axiosInstance';
import exerciseData from '../components/Health/HealthInfoData';
import TitlewithBtn from '../components/TitlewithBtn';
import DaySelector from '../components/routine/DaySelector';
import ExerciseCard from '../components/routine/ExerciseCard';
import ExerciseListBottomSheet from '../components/routine/ExerciseListBottomSheet';
import RoutineBox from '../components/routine/RoutineBox';

const baseURL = 'https://dev.bodycheck.store';

function Routine() {
  // 요일별 weekId 매핑
  const dayMapping = {일: 1, 월: 2, 화: 3, 수: 4, 목: 5, 금: 6, 토: 7};
  const reverseDayMapping = {
    0: '일',
    1: '월',
    2: '화',
    3: '수',
    4: '목',
    5: '금',
    6: '토',
  };
  const currentDay = new Date().getDay(); // 오늘 요일을 숫자로 가져옴 (0 = 일요일, 1 = 월요일, ..., 6 = 토요일)
  const [selectedDay, setSelectedDay] = useState(reverseDayMapping[currentDay]); // 선택된 요일을 관리하는 state
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
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // 선택된 요일 변경 시 루틴 데이터 가져오기
    fetchRoutineData(selectedDay);
  }, [selectedDay]);

  // 루틴 데이터 가져오는 함수
  const fetchRoutineData = async day => {
    const weekId = dayMapping[day];
    try {
      const response = await instance.get(
        `${baseURL}/api/routine/list/${weekId}`,
      );
      if (response.data.isSuccess) {
        const fetchedRoutines = response.data.result.map(item => {
          // exerciseData에서 운동 객체 찾기
          const exercise = exerciseData.find(
            ex => ex.title === item.exercise, // API 응답의 item.exercise와 exerciseData의 title이 일치하는지 확인
          );
          return exercise || null; // 운동이 없을 경우 null 반환
        });

        // 응답 데이터를 현재 요일의 루틴에 반영
        setRoutines(prev => ({
          ...prev,
          [day]: fetchedRoutines, // null 포함한 배열 반영
        }));
      } else {
        console.error('루틴 불러오기 실패:', response.data.message);
      }
    } catch (error) {
      console.error('루틴 데이터 API 호출 오류:', error);
    }
  };

  // 요일별 루틴 데이터를 API 요청 형식으로 변환하는 함수
  const prepareRoutineData = () => {
    const dayMapping = {일: 1, 월: 2, 화: 3, 수: 4, 목: 5, 금: 6, 토: 7};
    let routinesData = [];

    Object.keys(routines).forEach(day => {
      routines[day].forEach((exercise, index) => {
        routinesData.push({
          weekId: dayMapping[day],
          routineIdx: index + 1,
          exerciseId: exercise ? exercise.id : null, // 운동이 없으면 null로 설정
          isUpdated: true,
        });
      });
    });

    return {routines: routinesData};
  };

  // 저장하기 버튼 클릭 시 API 호출
  const handleSaveRoutines = async () => {
    const data = prepareRoutineData();
    try {
      const response = await instance.post(
        `${baseURL}/api/routine/update`,
        data,
      );
      if (response.data.isSuccess) {
        Alert.alert('루틴이 성공적으로 저장되었습니다.');
        setIsEditing(false); // 저장 후 설정 모드로 전환
      } else {
        console.error('루틴 저장 실패:', response.data.message);
      }
    } catch (error) {
      console.error('루틴 저장 API 호출 오류:', error);
    }
  };

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
        buttonText={isEditing ? '저장하기 >' : '설정하기 >'}
        onPress={isEditing ? handleSaveRoutines : toggleEditing}
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
