import React, {useState} from 'react';
import styled from 'styled-components/native';

const GenderSelection = ({value, onChange}) => {
  const handleGenderClick = gender => {
    onChange(gender); // 부모 컴포넌트로 선택한 성별 전달
  };

  return (
    <Container>
      <LabelContainer>
        <Label>성별</Label>
        <StarTag>*</StarTag>
      </LabelContainer>
      <GButtonWrapper>
        <GenderButton
          isSelected={value === 'MALE'}
          onPress={() => handleGenderClick('MALE')}>
          <ButtonText isSelected={value === 'MALE'}>남성</ButtonText>
        </GenderButton>
        <GenderButton
          isSelected={value === 'FEMALE'}
          onPress={() => handleGenderClick('FEMALE')}>
          <ButtonText isSelected={value === 'FEMALE'}>여성</ButtonText>
        </GenderButton>
      </GButtonWrapper>
    </Container>
  );
};

export default GenderSelection;

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
  margin-top: 30px;
`;

const StarTag = styled.Text`
  font-size: 12px;
  color: red;
  padding-bottom: 3px;
  margin-left: 2px;
`;

const GButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const GenderButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 49%;
  height: 45px;
  border-radius: 5px;
  border-width: 1px;
  border-color: #c8c8c8;
  background-color: ${props => (props.isSelected ? '#3373eb' : '#fff')};
`;

const ButtonText = styled.Text`
  color: ${props => (props.isSelected ? '#fff' : '#000')};
  font-size: 12px;
`;
