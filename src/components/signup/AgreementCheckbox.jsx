import React, {useState} from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';

const AgreementCheckbox = ({label, required, onValueChange}) => {
  const [checked, setChecked] = useState(false);

  const toggleCheckbox = () => {
    const newValue = !checked;
    setChecked(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <CheckboxContainer>
      <TouchableOpacity onPress={toggleCheckbox}>
        <Checkbox checked={checked}>{checked && <Checkmark />}</Checkbox>
      </TouchableOpacity>
      <Label>
        {label} {required && <RequiredText>(필수)</RequiredText>}
      </Label>
    </CheckboxContainer>
  );
};

export default AgreementCheckbox;

// 스타일드 컴포넌트
const CheckboxContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const Checkbox = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border-width: 1px;
  border-color: #333;
  background-color: ${props => (props.checked ? '#3373eb' : '#fff')};
  justify-content: center;
  align-items: center;
`;

const Checkmark = styled.View`
  width: 12px;
  height: 12px;
  background-color: white;
`;

const Label = styled.Text`
  font-size: 12px;
  margin-left: 10px;
`;

const RequiredText = styled.Text`
  color: #ed6227;
  font-size: 12px;
`;
