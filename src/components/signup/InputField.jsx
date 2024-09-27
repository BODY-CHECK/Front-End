import styled from 'styled-components';
import {Text} from 'react-native';

const InputField = ({
  label,
  withLabel,
  placeholder,
  required,
  withAuthButton,
  withCheckButton,
}) => {
  return (
    <>
      {withLabel && (
        <LabelContainer withLabel={withLabel}>
          <Label>{label}</Label>
          {required && <StarTag>*</StarTag>}
        </LabelContainer>
      )}
      <InputContainer>
        <Input placeholder={placeholder} />
        {withAuthButton && (
          <AuthButton>
            <Text style={{color: '#fff'}}>인증 요청</Text>
          </AuthButton>
        )}
        {withCheckButton && (
          <AuthButton>
            <Text style={{color: '#fff'}}>확인</Text>
          </AuthButton>
        )}
      </InputContainer>
    </>
  );
};

export default InputField;

const Label = styled.Text`
  font-size: 12px;
  color: black;
  margin-bottom: 8px;
`;

const StarTag = styled.Text`
  font-size: 12px;
  color: red;
  padding-bottom: 3px;
  margin-left: 2px;
`;

const LabelContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  margin-top: ${({withLabel}) => (withLabel ? '20px' : '0px')};
`;

const Input = styled.TextInput`
  border-radius: 5px;
  border-width: 1px;
  border-color: #c8c8c8;
  padding: 8px;
  height: 50px;
  flex: 1;
`;

const AuthButton = styled.TouchableOpacity`
  width: 72px;
  height: 48px;
  background-color: #3373eb;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  color: white;
  margin-left: 10px;
`;

const InputContainer = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 5px;
`;
