import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, Modal, Text} from 'react-native';
import styled from 'styled-components/native';
import instance from '../axiosInstance';
import exerciseData from '../components/Health/HealthInfoData';
import TitlewithBtn from '../components/TitlewithBtn';
import DaySelector from '../components/routine/DaySelector';
import ExerciseCard from '../components/routine/ExerciseCard';
import ExerciseListBottomSheet from '../components/routine/ExerciseListBottomSheet';
import RoutineBox from '../components/routine/RoutineBox';
import ChatBot from '../assets/images/ChatBot.png';
import ChatBotModal from '../components/routine/ChatBotModal';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import ConfirmModal from '../components/ConfirmModal';

const baseURL = 'https://dev.bodycheck.store';

// 요일별 루틴을 파싱하는 함수
const parseRoutineText = text => {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const routines = {};

  days.forEach(day => {
    // 요일별로 텍스트를 추출하는 정규식
    const regex = new RegExp(`${day}\\s*-\\s*([^\\n]*)`, 'g');
    const match = regex.exec(text);

    if (match && match[1]) {
      routines[day] = match[1]
        .split(/[,]/) // 쉼표 기준으로 운동 분리
        .map(item => item.trim()) // 앞뒤 공백 제거
        .filter(exercise => exercise && !exercise.includes('휴식')); // "휴식" 제외
    } else {
      routines[day] = []; // 해당 요일에 운동이 없으면 빈 배열
    }
  });

  console.log('Parsed Routines:', routines); // 디버깅 로그
  return routines;
};

// 운동 이름을 exerciseData와 매칭하는 함수
const matchExerciseNames = (exerciseName: string, exerciseData: any[]) => {
  const matchedExercise = exerciseData.find(
    exercise =>
      exercise.title.replace(/\s+/g, '').toLowerCase() ===
      exerciseName.replace(/\s+/g, '').toLowerCase(),
  );

  if (!matchedExercise) {
    console.error(`운동 이름 매칭 실패: ${exerciseName}`); // 매칭되지 않는 운동 로그
  }

  return matchedExercise || null;
};

function Routine() {
  const [isChatBotVisible, setIsChatBotVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [confirmModalVisible, setConirmModalVisible] = useState(false); // 모달 상태
  const [confirmModalMessage, setConfirmModalMessage] = useState(''); // 모달 메시지

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
  const beginnerRoutine = {
    월: [exerciseData[1], exerciseData[5], exerciseData[10]],
    화: [exerciseData[1], exerciseData[6], exerciseData[9]],
    수: [exerciseData[5], exerciseData[10], exerciseData[7]],
    목: [exerciseData[1], exerciseData[5], exerciseData[10]],
    금: [exerciseData[6], exerciseData[7], exerciseData[10]],
    토: [exerciseData[5], exerciseData[9], exerciseData[8]],
    일: [exerciseData[1], exerciseData[7], exerciseData[5]],
  };

  const advancedRoutine = {
    월: [exerciseData[0], exerciseData[2], exerciseData[4]],
    화: [exerciseData[3], exerciseData[7], exerciseData[11]],
    수: [exerciseData[0], exerciseData[4], exerciseData[6]],
    목: [exerciseData[2], exerciseData[8], exerciseData[9]],
    금: [exerciseData[0], exerciseData[5], exerciseData[6]],
    토: [exerciseData[3], exerciseData[7], exerciseData[8]],
    일: [exerciseData[0], exerciseData[9], exerciseData[11]],
  };

  const handleOtherActions = useCallback(() => {
    // 설정 모드 종료
    if (isEditing) setIsEditing(false);
  }, [isEditing]);

  // 화면 포커스 시 오늘 날짜로 초기화 및 편집 모드 끄기
  useFocusEffect(
    useCallback(() => {
      setSelectedDay(reverseDayMapping[currentDay]); // 오늘 요일로 설정
      setIsEditing(false); // 편집 모드 해제
    }, []),
  );

  useEffect(() => {
    // 선택된 요일 변경 시 루틴 데이터 가져오기
    if (!isEditing) {
      fetchRoutineData(selectedDay);
    }
  }, [selectedDay, isEditing]);

  // 챗봇 루틴을 저장하는 함수
  const handleSaveChatbotRoutine = async (routineText: string) => {
    // 텍스트에서 요일별 루틴 파싱
    const parsedRoutines = parseRoutineText(routineText);
    console.log('Parsed Routines:', parsedRoutines);

    // 각 요일별로 운동을 매칭하고 새로운 루틴 객체 생성
    const newRoutines = Object.keys(parsedRoutines).reduce((acc, day) => {
      const dayExercises = parsedRoutines[day];
      const matchedExercises = Array(3).fill(null); // 기본적으로 3개의 null로 초기화

      // 찾은 운동들을 순서대로 배열에 넣기
      dayExercises.forEach((exerciseName, index) => {
        if (index < 3) {
          // 최대 3개까지만 저장
          const matchedExercise = matchExerciseNames(
            exerciseName,
            exerciseData,
          );
          if (matchedExercise) {
            matchedExercises[index] = matchedExercise;
          }
        }
      });

      return {
        ...acc,
        [day]: matchedExercises,
      };
    }, {});

    console.log('Matched Routines:', newRoutines); // 매칭된 루틴 로그

    // 서버에 저장하기 위한 데이터 준비
    const routinesData = Object.keys(newRoutines).flatMap(day =>
      newRoutines[day].map((exercise, idx) => ({
        weekId: dayMapping[day],
        routineIdx: idx + 1,
        exerciseId: exercise ? exercise.id : null,
        isUpdated: true,
      })),
    );

    console.log('Prepared Routines Data for API:', routinesData); // 서버로 보낼 데이터 로그

    try {
      const response = await instance.post(`${baseURL}/api/routine/update`, {
        routines: routinesData,
      });

      if (response.data.isSuccess) {
        console.log('루틴 저장 성공: ', response.data.message);
        setRoutines(newRoutines); // 로컬 상태 업데이트
        setIsChatBotVisible(false); // 챗봇 모달 닫기
      } else {
        setConirmModalVisible(true);
        setConfirmModalMessage(response.data.message);
      }
    } catch (error) {
      console.error('루틴 저장 API 호출 오류:', error);
      setConirmModalVisible(true);
      setConfirmModalMessage('루틴 저장 중 오류가 발생했습니다.');
    }
  };

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
        setConirmModalVisible(true);
        setConfirmModalMessage('루틴이 저장되었습니다.');
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

  // 루틴 업데이트 함수
  const handleSetRoutine = async routineType => {
    const newRoutine =
      routineType === '헬린이' ? beginnerRoutine : advancedRoutine;

    setRoutines(newRoutine); // 로컬 상태 업데이트

    // 서버에 저장
    const data = Object.keys(newRoutine).flatMap(day =>
      newRoutine[day].map((exercise, idx) => ({
        weekId: dayMapping[day],
        routineIdx: idx + 1,
        exerciseId: exercise ? exercise.id : null,
        isUpdated: true,
      })),
    );

    try {
      const response = await instance.post(`${baseURL}/api/routine/update`, {
        routines: data,
      });

      if (response.data.isSuccess) {
        console.log('루틴 설정 성공:', response.data.message);
      } else {
        console.error('루틴 설정 실패:', response.data.message);
      }
    } catch (error) {
      console.error('루틴 설정 API 호출 오류:', error);
    }
  };

  const checkPremiumStatus = async () => {
    handleOtherActions(); // 운동 선택 시 설정 모드 해제
    try {
      const response = await instance.get('/members/my-page');
      if (response.data.isSuccess) {
        const {premium} = response.data.result;

        if (premium) {
          // premium이 true일 경우 챗봇 모달 띄움
          setIsChatBotVisible(true);
        } else {
          // premium이 false일 경우 프리미엄 안내 모달 띄움
          setModalVisible(true);
          console.log(response.data.message);
        }
      } else {
        Alert.alert('에러', '회원 정보를 가져오지 못했습니다.');
      }
    } catch (error) {
      console.error('Premium 상태 확인 오류:', error);
      Alert.alert('에러', '회원 정보를 가져오는 중 문제가 발생했습니다.');
    }
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
      <ExerciseCard
        onSetRoutine={handleSetRoutine}
        onCardPress={handleOtherActions}
      />
      <ChatBotBtn onPress={checkPremiumStatus}>
        <ChatBotImg source={ChatBot} />
      </ChatBotBtn>
      <ExerciseListBottomSheet
        sheetRef={sheetRef}
        onSelect={handleExerciseSelect}
      />
      <ChatBotModal
        visible={isChatBotVisible}
        onClose={() => setIsChatBotVisible(false)}
        onSaveRoutine={handleSaveChatbotRoutine}
        exerciseData={exerciseData}
      />
      {/* 모달 컴포넌트 */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <ModalContainer>
          <ModalView>
            <ModalText>
              이 서비스는{' '}
              <Text
                style={{
                  color: '#3373eb',
                  fontWeight: 'bold',
                }}>
                프리미엄 회원
              </Text>
              만 이용가능합니다.
            </ModalText>
            <SubText>프리미엄 서비스를 구독하시겠습니까?</SubText>
            <ButtonContainer>
              <ConfirmButton
                onPress={() => {
                  navigation.navigate('RoutineSubscriptionHandler');
                  setModalVisible(false);
                }}>
                <ButtonText style={{color: '#fff'}}>확인</ButtonText>
              </ConfirmButton>
              <CancelButton onPress={() => setModalVisible(false)}>
                <ButtonText>취소</ButtonText>
              </CancelButton>
            </ButtonContainer>
          </ModalView>
        </ModalContainer>
      </Modal>
      <ConfirmModal
        visible={confirmModalVisible}
        message={confirmModalMessage}
        onConfirm={() => setConirmModalVisible(false)}
      />
    </Container>
  );
}

export default Routine;

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #fff;
  padding: 20px;
`;

const ChatBotBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

const ChatBotImg = styled.Image`
  width: 90px;
  height: 90px;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* 배경 투명도 조절 */
`;

const ModalView = styled.View`
  width: 80%;
  height: 185px;
  padding: 20px;
  background-color: white;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;

const ModalText = styled.Text`
  font-size: 16px;
  text-align: center;
  margin-bottom: 10px;
  color: black;
`;

const SubText = styled.Text`
  font-size: 14px;
  color: #7c86a2;
  margin-bottom: 35px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

const ConfirmButton = styled.TouchableOpacity`
  background-color: #3373eb;
  width: 45%;
  height: 40px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin: 0 7px 0 5px;
`;

const CancelButton = styled.TouchableOpacity`
  background-color: #3c3b40;
  width: 45%;
  height: 40px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin: 0 5px 0 7px;
`;

const ButtonText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: white;
`;
