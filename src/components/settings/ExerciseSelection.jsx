import React from 'react';
import styled from 'styled-components/native';

const ExerciseSelection = ({value, onChange}) => {
  const handleExerciseClick = exercise => {
    onChange(exercise); // 부모 컴포넌트로 선택한 성별 전달
  };

  return (
    <Container>
      <LabelContainer>
        <Label>선호 부위</Label>
      </LabelContainer>
      <GButtonWrapper>
        <GenderButton
          isSelected={value === 'UPPER_BODY'}
          onPress={() => handleExerciseClick('UPPER_BODY')}>
          <ButtonText isSelected={value === 'UPPER_BODY'}>상체</ButtonText>
        </GenderButton>
        <GenderButton
          isSelected={value === 'LOWER_BODY'}
          onPress={() => handleExerciseClick('LOWER_BODY')}>
          <ButtonText isSelected={value === 'LOWER_BODY'}>하체</ButtonText>
        </GenderButton>
        <GenderButton
          isSelected={value === null}
          onPress={() => handleExerciseClick(null)}>
          <ButtonText isSelected={value === null}>밸런스</ButtonText>
        </GenderButton>
      </GButtonWrapper>
    </Container>
  );
};

export default ExerciseSelection;

const Container = styled.View`
  flex-direction: column;
`;

const Label = styled.Text`
  font-size: 12px;
  color: black;
  margin-bottom: 8px;
`;

const LabelContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  margin-top: 10px;
`;

const GButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const GenderButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 33%;
  height: 45px;
  border-width: 1px;
  border-color: #c8c8c8;
  background-color: ${props => (props.isSelected ? '#3373eb' : '#fff')};
`;

const ButtonText = styled.Text`
  color: ${props => (props.isSelected ? '#fff' : '#000')};
  font-size: 12px;
`;
