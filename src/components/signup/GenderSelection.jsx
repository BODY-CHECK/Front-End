import React, {useState} from 'react';
import styled from 'styled-components/native';

const GenderSelection = () => {
  const [selectedGender, setSelectedGender] = useState(null);

  const handleGenderClick = gender => {
    setSelectedGender(gender);
  };

  return (
    <Container>
      <LabelContainer>
        <Label>성별</Label>
        <StarTag>*</StarTag>
      </LabelContainer>
      <GButtonWrapper>
        <GenderButton
          isSelected={selectedGender === 'male'}
          onPress={() => handleGenderClick('male')}>
          <ButtonText isSelected={selectedGender === 'male'}>남성</ButtonText>
        </GenderButton>
        <GenderButton
          isSelected={selectedGender === 'female'}
          onPress={() => handleGenderClick('female')}>
          <ButtonText isSelected={selectedGender === 'female'}>여성</ButtonText>
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
  margin-top: 20px;
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
  font-size: 16px;
`;
