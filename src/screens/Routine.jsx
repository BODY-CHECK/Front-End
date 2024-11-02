import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, Modal} from 'react-native';
import styled from 'styled-components/native';
import instance from '../axiosInstance';
import TitlewithBtn from '../components/TitlewithBtn';
import DaySelector from '../components/routine/DaySelector';
import ExerciseCard from '../components/routine/ExerciseCard';
import ExerciseListBottomSheet from '../components/routine/ExerciseListBottomSheet';
import RoutineBox from '../components/routine/RoutineBox';
import exerciseData from '../components/Health/HealthInfoData';

const baseURL = 'https://dev.bodycheck.store';

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
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 요일별 weekId 매핑
  const dayMapping = {월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6, 일: 7};

  useEffect(() => {
    const checkFirstVisit = async () => {
      const hasVisited = await AsyncStorage.getItem('hasVisitedRoutinePage');
      if (!hasVisited) {
        setIsModalVisible(true); // 최초 접속 시 모달 표시
      }
    };
    checkFirstVisit();
  }, []);

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

  // 루틴 생성 함수 (최초 접속 시 실행)
  const handleCreateRoutine = async () => {
    try {
      const response = await instance.post(`${baseURL}/api/routine/setting`);
      if (response.data.isSuccess) {
        const routinesData = response.data.result.reduce(
          (acc, item) => {
            const day = ['월', '화', '수', '목', '금', '토', '일'][
              item.weekId - 1
            ];
            acc[day][item.routineIdx - 1] = item.exercise;
            return acc;
          },
          {...routines},
        );
        setRoutines(routinesData);

        await AsyncStorage.setItem('hasVisitedRoutinePage', 'true'); // 최초 방문 기록 저장
        setIsModalVisible(false); // 모달 닫기
      } else {
        console.error('루틴 생성 실패:', response.data.message);
      }
    } catch (error) {
      console.error('루틴 생성 API 호출 오류:', error);
    }
  };

  // 요일별 루틴 데이터를 API 요청 형식으로 변환하는 함수
  const prepareRoutineData = () => {
    const dayMapping = {월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6, 일: 7};
    let routinesData = [];

    Object.keys(routines).forEach(day => {
      routines[day].forEach((exercise, index) => {
        if (exercise) {
          routinesData.push({
            weekId: dayMapping[day],
            routineIdx: index + 1,
            exerciseId: exercise ? exercise.exerciseId : null,
            isUpdated: true,
          });
        }
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
      {/* 최초 접속 안내 모달 */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}>
        <ModalContainer>
          <ModalContent>
            <ModalText>루틴을 생성하시겠습니까?</ModalText>
            <Button title="확인" onPress={handleCreateRoutine} />
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #fff;
  padding: 20px;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  width: 80%;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  align-items: center;
`;

const ModalText = styled.Text`
  margin-bottom: 20px;
  font-size: 16px;
`;

export default Routine;
