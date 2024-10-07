import React, {useMemo, useCallback} from 'react';
import {Text} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';

const exercises = [
  {
    id: '1',
    name: '푸쉬업',
    image: require('../../assets/images/Health/push-up.png'),
  },
  {
    id: '2',
    name: '푸쉬업(무릎)',
    image: require('../../assets/images/Health/kneeing-push-up.png'),
  },
  {
    id: '3',
    name: '풀업',
    image: require('../../assets/images/Health/pull-up.png'),
  },
  {
    id: '4',
    name: '풀업(밴드)',
    image: require('../../assets/images/Health/banding-pull-up.png'),
  },
  {
    id: '5',
    name: '윗몸일으키기',
    image: require('../../assets/images/Health/sit-ups.png'),
  },
  {
    id: '6',
    name: '레그레이즈',
    image: require('../../assets/images/Health/leg-raise.png'),
  },
  {
    id: '7',
    name: '레그레이즈(행잉)',
    image: require('../../assets/images/Health/hanging-leg-raise.png'),
  },
  {
    id: '8',
    name: '스쿼트',
    image: require('../../assets/images/Health/squat.png'),
  },
  {
    id: '9',
    name: '한 발 스쿼트',
    image: require('../../assets/images/Health/one-leg-squat.png'),
  },
  {
    id: '10',
    name: '런지',
    image: require('../../assets/images/Health/lunge.png'),
  },
  {
    id: '11',
    name: '카프레이즈',
    image: require('../../assets/images/Health/calf-raise.png'),
  },
  {
    id: '12',
    name: '힙 쓰러스트',
    image: require('../../assets/images/Health/hip-thrust.png'),
  },
];

const ExerciseListBottomSheet = ({sheetRef}) => {
  // snap points 설정
  const snapPoints = useMemo(() => ['75%'], []);

  // 시트 상태가 변경될 때 호출되는 함수
  const handleSheetChanges = useCallback(index => {
    console.log('Sheet index:', index);
  }, []);

  // 커스텀 backdrop (배경)
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1} // 닫힐 때 배경 흐림 효과 제거
        opacity={0.7} // 배경의 흐림도 설정
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1} // 처음에 닫힌 상태로 시작
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop} // backdrop 적용
      enablePanDownToClose={true} // 슬라이드로 닫기
      enableBackdropDismiss={true} // 배경 터치로 닫기
    >
      <ModalContent>
        <SheetHeader>
          <SheetTitle>운동 종류</SheetTitle>
          <CloseButton onPress={() => sheetRef.current?.close()}>
            <Text style={{fontSize: 20}}>X</Text>
          </CloseButton>
        </SheetHeader>

        <BottomSheetScrollView>
          <ExerciseGrid>
            {exercises.map(exercise => (
              <ExerciseItem key={exercise.id}>
                <ExerciseImage source={exercise.image} />
                <ExerciseText>{exercise.name}</ExerciseText>
              </ExerciseItem>
            ))}
          </ExerciseGrid>
        </BottomSheetScrollView>
      </ModalContent>
    </BottomSheet>
  );
};

export default ExerciseListBottomSheet;

// 스타일 정의
const ModalContent = styled.View`
  background-color: #fff;
  padding: 20px;
  flex: 1;
`;

const SheetHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
`;

const SheetTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: black;
`;

const CloseButton = styled.TouchableOpacity``;

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
  width: 92px;
  height: 92px;
  border-radius: 15px;
  border-width: 1px;
  border-color: #3373eb;
  margin-bottom: 10px;
`;

const ExerciseText = styled.Text`
  font-size: 14px;
  color: #333;
`;
