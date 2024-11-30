import {useState} from 'react';
import styled from 'styled-components/native';

const SizeInput = ({onHeightChange, onWeightChange, required}) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleHeightChange = value => {
    setHeight(value);
    onHeightChange(value); // 키 변경 시 부모 컴포넌트로 전달
  };

  const handleWeightChange = value => {
    setWeight(value);
    onWeightChange(value); // 몸무게 변경 시 부모 컴포넌트로 전달
  };

  return (
    <Container>
      <SInputWrapper>
        <SContainer>
          <LabelContainer>
            <SLabel>키</SLabel>
            {required && <StarTag>*</StarTag>}
          </LabelContainer>

          <SInput
            value={height}
            onChangeText={handleHeightChange}
            keyboardType="numeric"
          />
          <UnitText>cm</UnitText>
        </SContainer>
        <SContainer>
          <LabelContainer>
            <SLabel>몸무게</SLabel>
            {required && <StarTag>*</StarTag>}
          </LabelContainer>
          <SInput
            value={weight}
            onChangeText={handleWeightChange}
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
  margin-top: 30px;
`;

const SLabel = styled.Text`
  font-size: 12px;
  color: black;
  margin-bottom: 8px;
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

const StarTag = styled.Text`
  font-size: 12px;
  color: red;
  padding-bottom: 3px;
  margin-left: 2px;
`;

const LabelContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
