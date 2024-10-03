import React from 'react';
import styled from 'styled-components/native';
import {FlatList} from 'react-native';

const exercises = [
  {
    id: '1',
    name: '푸쉬업',
    reps: 'x 12',
    image: require('../../assets/images/Health/push-up.png'),
  },
  {
    id: '2',
    name: '스쿼트',
    reps: 'x 12',
    image: require('../../assets/images/Health/squat.png'),
  },
  {
    id: '3',
    name: '풀업',
    reps: 'x 12',
    image: require('../../assets/images/Health/pull-up.png'),
  },
  {
    id: '4',
    name: '윗몸 일으키기',
    reps: 'x 12',
    image: require('../../assets/images/Health/sit-ups.png'),
  },
];

const AIptBox = () => {
  const renderItem = ({item}) => (
    <ExerciseItem>
      <ExerciseImage source={item.image} />
      <ExerciseDetails>
        <ExerciseName>{item.name}</ExerciseName>
        <ExerciseReps>{item.reps}</ExerciseReps>
      </ExerciseDetails>
    </ExerciseItem>
  );

  return (
    <Container>
      <FlatList
        data={exercises}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default AIptBox;

const Container = styled.View`
  width: 100%;
  height: 415px;
  border-radius: 15px;
  elevation: 5;
  background-color: #fff;
  padding-right: 15px;
`;

const ExerciseItem = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom: 1px;
  border-color: black;
  padding: 10px;
`;

const ExerciseImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 15px;
  border-width: 1px;
  border-color: #3373eb;
  margin-right: 10px;
`;

const ExerciseDetails = styled.View`
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 5px;
  border-bottom-width: 1px;
  border-color: #999999;
`;

const ExerciseName = styled.Text`
  font-size: 16px;
  margin-top: 16px;
  font-weight: bold;
  color: #333;
  margin-left: 5px;
`;

const ExerciseReps = styled.Text`
  font-size: 14px;
  color: #777;
  margin-left: 5px;
`;
