import React from 'react';
import styled from 'styled-components/native';
import {FlatList} from 'react-native';
import exerciseData from '../Health/HealthInfoData';

// 4개의 랜덤 운동 선택 함수
const getRandomExercises = (data, count) => {
  return data.sort(() => Math.random() - 0.5).slice(0, count);
};

const AIptBox = () => {
  const randomExercises = getRandomExercises(exerciseData, 4); // 4개의 랜덤 운동 선택

  const renderItem = ({item}) => (
    <ExerciseItem>
      <ExerciseImage source={item.imageSource} />
      <ExerciseDetails>
        <NameRepsWrapper>
          <ExerciseName>{item.title}</ExerciseName>
          <ExerciseReps>x 12</ExerciseReps>
        </NameRepsWrapper>
        <MuscleWrapper>
          <MainMuscle>{item.mainMuscle}</MainMuscle>
        </MuscleWrapper>
      </ExerciseDetails>
    </ExerciseItem>
  );

  return (
    <Container>
      <FlatList
        data={randomExercises}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default AIptBox;

const Container = styled.View`
  flex: 1;
  width: 100%;
  background-color: #fff;
  justify-content: space-evenly;
`;

const ExerciseItem = styled.View`
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  border-width: 0.5px;
  border-color: #999999;
  margin-bottom: 8px;
  padding: 10px 8px;
`;

const ExerciseImage = styled.Image`
  width: 80px;
  height: 80px;
  margin-right: 10px;
`;

const ExerciseDetails = styled.View`
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 5px;
`;

const ExerciseName = styled.Text`
  font-size: 15px;
  margin-top: 16px;
  font-weight: bold;
  color: #333;
  margin-left: 5px;
`;

const ExerciseReps = styled.Text`
  font-size: 13px;
  margin-top: 18px;
  color: #777;
  margin-left: 8px;
`;

const MuscleWrapper = styled.View`
  align-self: flex-start;
  text-align: center;
  justify-content: center;
  background-color: #3373eb;
  border-radius: 5px;
  margin-left: 4px;
  padding: 4px 16px 6px 16px;
`;

const MainMuscle = styled.Text`
  font-size: 9px;
  font-weight: bold;
  color: #fff;
`;

const NameRepsWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;
