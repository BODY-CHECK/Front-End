import React from 'react';
import {Text, View, TouchableOpacity, Image, ScrollView} from 'react-native';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import styled from 'styled-components/native';

const exercises = [
  {
    id: '1',
    name: '푸쉬업',
    image: require('../../assets/images/Health/push-up.png'),
  },
  {
    id: '2',
    name: '윗몸일으키기',
    image: require('../../assets/images/Health/push-up.png'),
  },
  {
    id: '3',
    name: '풀업',
    image: require('../../assets/images/Health/push-up.png'),
  },
  // 추가 운동 항목
];

const ExerciseListBottomSheet = ({sheetRef}) => {
  const renderContent = () => (
    <ModalContent>
      <SheetHeader>
        <SheetTitle>운동 종류</SheetTitle>
        <CloseButton onPress={() => sheetRef.current.snapTo(1)}>
          <Text style={{fontSize: 20}}>X</Text>
        </CloseButton>
      </SheetHeader>
      <ScrollView>
        <ExerciseGrid>
          {exercises.map(exercise => (
            <ExerciseItem key={exercise.id}>
              <ExerciseImage source={exercise.image} />
              <ExerciseText>{exercise.name}</ExerciseText>
            </ExerciseItem>
          ))}
        </ExerciseGrid>
      </ScrollView>
    </ModalContent>
  );

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={[450, 0]}
      borderRadius={10}
      renderContent={renderContent}
      initialSnap={1} // 처음에 BottomSheet가 닫혀있도록 설정
      enabledGestureInteraction={true}
    />
  );
};

export default ExerciseListBottomSheet;

// 스타일 정의
const ModalContent = styled.View`
  background-color: #fff;
  padding: 20px;
  height: 450px;
`;

const SheetHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SheetTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 10px;
`;

const ExerciseGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ExerciseItem = styled.View`
  width: 30%;
  margin-bottom: 20px;
  align-items: center;
`;

const ExerciseImage = styled.Image`
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
`;

const ExerciseText = styled.Text`
  font-size: 14px;
  color: #333;
`;
