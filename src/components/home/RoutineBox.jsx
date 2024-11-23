import React, {useCallback, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import instance from '../../axiosInstance';
import exerciseData from '../Health/HealthInfoData';
import check from '../../assets/images/check.png';

const baseURL = 'https://dev.bodycheck.store';

const HomeRoutineBox = () => {
  const navigation = useNavigation();
  const [routines, setRoutines] = useState([null, null, null]);
  const [hasRoutine, setHasRoutine] = useState(false);
  const [routineChecks, setRoutineChecks] = useState([false, false, false]);

  // 요일 매핑
  const dayMapping = {
    0: '일',
    1: '월',
    2: '화',
    3: '수',
    4: '목',
    5: '금',
    6: '토',
  };
  const currentDay = new Date().getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
  const dayName = dayMapping[currentDay];

  // 현재 요일의 루틴 데이터를 불러오는 함수
  const fetchRoutineData = async () => {
    try {
      const response = await instance.get(
        `${baseURL}/api/routine/list/${currentDay + 1}`,
      );
      if (response.data.isSuccess && response.data.result.length > 0) {
        const fetchedRoutines = response.data.result.map(item => {
          const exercise = exerciseData.find(ex => ex.title === item.exercise);
          return exercise || null;
        });
        const routineChecks = response.data.result.map(
          item => item.routineCheck,
        );

        const hasValidExercises = fetchedRoutines.some(
          exercise => exercise !== null,
        );

        setRoutines(fetchedRoutines);
        setRoutineChecks(routineChecks);
        setHasRoutine(hasValidExercises);
      } else {
        setHasRoutine(false);
      }
    } catch (error) {
      console.error('루틴 데이터 가져오기 오류:', error);
      setHasRoutine(false);
    }
  };

  // 화면에 포커스될 때마다 루틴 데이터 가져오기
  useFocusEffect(
    useCallback(() => {
      fetchRoutineData();
    }, []),
  );

  return (
    <Container>
      {hasRoutine ? (
        <RoutineWrapper>
          {routines.map((exercise, index) => (
            <ItemWrapper key={index}>
              <RoutineItem>
                {exercise ? (
                  <>
                    <ExerciseImage source={exercise.imageSource} />
                    {routineChecks[index] && (
                      <CheckImage
                        source={require('../../assets/images/check.png')}
                      />
                    )}
                  </>
                ) : (
                  <PlusImage>+</PlusImage>
                )}
              </RoutineItem>
              <RoutineText>{exercise ? exercise.title : '미설정'}</RoutineText>
            </ItemWrapper>
          ))}
        </RoutineWrapper>
      ) : (
        <NoRoutineWrapper>
          <TouchableOpacity onPress={() => navigation.navigate('운동 루틴')}>
            <Plus>+</Plus>
          </TouchableOpacity>
          <NoRoutineText>회원님만의 루틴을 만들어보세요.</NoRoutineText>
        </NoRoutineWrapper>
      )}
    </Container>
  );
};

export default HomeRoutineBox;

const Container = styled.View`
  width: 100%;
  height: 156px;
  border-radius: 10px;
  border-width: 0.5px;
  border-color: #999999;
  background-color: #fff;
  margin-bottom: 30px;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const RoutineWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 25px;
`;

const ItemWrapper = styled.View`
  flex-direction: column;
  align-items: center;
`;

const RoutineItem = styled.View`
  width: 92px;
  height: 92px;
  background-color: #fff;
  margin-bottom: 12px;
  align-items: center;
  justify-content: center;
  padding-bottom: 5px;
`;

const RoutineText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: black;
`;

const Plus = styled.Text`
  font-size: 90px;
  font-weight: 200;
  color: #6d6d6d;
  margin-top: -25px;
  margin-bottom: -15px;
`;

const NoRoutineText = styled.Text`
  font-size: 10px;
  color: #3c3b40;
`;

const NoRoutineWrapper = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ExerciseImage = styled.Image`
  width: 80px;
  height: 80px;
`;

const PlusImage = styled.Text`
  margin-top: 20px;
  font-size: 50px;
  color: #e5e5e5;
`;

const CheckImage = styled.Image`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
`;
