import {useState} from 'react';
import styled from 'styled-components/native';

const SizeInput = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  return (
    <Container>
      <SInputWrapper>
        <SContainer>
          <SLabel>키</SLabel>
          <SInput
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
          <UnitText>cm</UnitText>
        </SContainer>
        <SContainer>
          <SLabel>몸무게</SLabel>
          <SInput
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
          <UnitText>kg</UnitText>
        </SContainer>
      </SInputWrapper>
    </Container>
  );
};

export default SizeInput;

const Container = styled.View`
  flex-direction: column;
  width: 100%;
`;

const SContainer = styled.View`
  flex-direction: column;
  width: 49%;
`;

const SLabel = styled.Text`
  font-size: 12px;
  color: black;
  margin-bottom: 8px;
  margin-top: 30px;
`;

const SInputWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const SInput = styled.TextInput`
  align-items: center;
  text-align: center;
  height: 45px;
  border-radius: 5px;
  border-width: 1px;
  border-color: #c8c8c8;
`;

const UnitText = styled.Text`
  font-size: 12px;
  color: #b0bec5;
`;
