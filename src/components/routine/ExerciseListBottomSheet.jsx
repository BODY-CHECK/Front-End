import React, {useMemo, useCallback, useState} from 'react';
import {Text} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';
import exerciseData from '../Health/HealthInfoData';

const ExerciseListBottomSheet = ({sheetRef, onSelect}) => {
  // snap points 설정
  const snapPoints = useMemo(() => ['75%'], []);

  const [filter, setFilter] = useState('전체'); // 필터 상태 추가

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

  const handleExercisePress = exercise => {
    onSelect(exercise);
  };

  // 필터에 따른 운동 데이터 필터링
  const filteredExercises = exerciseData.filter(exercise => {
    if (filter === '전체') return true;
    return exercise.type === filter;
  });

  const renderItem = ({item}) => (
    <ExerciseItem key={item.id} onPress={() => handleExercisePress(item)}>
      <ExerciseImage source={item.imageSource} />
      <ExerciseDetails>
        <ExerciseName>{item.title}</ExerciseName>
        <MuscleWrapper>
          <MainMuscle>{item.mainMuscle}</MainMuscle>
        </MuscleWrapper>
      </ExerciseDetails>
    </ExerciseItem>
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

        {/* 필터 버튼들 */}
        <FilterWrapper>
          <FilterButton
            isActive={filter === '전체'}
            onPress={() => setFilter('전체')}>
            <FilterText isActive={filter === '전체'}>전체</FilterText>
          </FilterButton>
          <FilterButton
            isActive={filter === '상체'}
            onPress={() => setFilter('상체')}>
            <FilterText isActive={filter === '상체'}>상체 운동</FilterText>
          </FilterButton>
          <FilterButton
            isActive={filter === '하체'}
            onPress={() => setFilter('하체')}>
            <FilterText isActive={filter === '하체'}>하체 운동</FilterText>
          </FilterButton>
        </FilterWrapper>

        <BottomSheetScrollView>
          {filteredExercises.map(exercise => renderItem({item: exercise}))}
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

const ExerciseItem = styled.TouchableOpacity`
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
  margin-bottom: 5px;
`;

const MuscleWrapper = styled.View`
  align-self: flex-start;
  text-align: center;
  justify-content: center;
  background-color: #3373eb;
  border-radius: 5px;
  margin-left: 4px;
  padding: 3px 16px 5px 16px;
`;

const MainMuscle = styled.Text`
  font-size: 9px;
  color: #fff;
  font-weight: bold;
`;

const FilterWrapper = styled.View`
  flex-direction: row;
  gap: 5px;
  margin-bottom: 15px;
`;

const FilterButton = styled.TouchableOpacity`
  background-color: ${({isActive}) => (isActive ? '#000' : '#fff')};
  align-items: center;
  justify-content: center;
  padding-bottom: 2px;
  width: 68px;
  height: 26px;
  border-radius: 13px;
  border-width: 1px;
  border-color: #000;
`;

const FilterText = styled.Text`
  color: ${({isActive}) => (isActive ? '#fff' : '#000')};
  font-size: 10px;
  font-weight: bold;
`;
