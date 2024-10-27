import styled from 'styled-components/native';
import {Text, TouchableOpacity} from 'react-native';
import {useState} from 'react';

const eye = require('../../assets/images/eye.png');
const eyeOff = require('../../assets/images/eye_off.png');

const InputField = ({
  label,
  withLabel,
  placeholder,
  required,
  withAuthButton,
  withCheckButton,
  value,
  onChangeText,
  errorMessage,
  isPasswordField,
  secureTextEntry,
  onPressBtn,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false); // 비밀번호 보이기 상태

  // 비밀번호 보이기/숨기기 토글
  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <>
      {withLabel && (
        <LabelContainer withLabel={withLabel}>
          <Label>{label}</Label>
          {required && <StarTag>*</StarTag>}
          {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        </LabelContainer>
      )}
      <InputContainer>
        <Input
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={
            isPasswordField ? !isPasswordVisible : secureTextEntry
          } // 비밀번호 필드일 때만 가리기 기능 적용
        />
        {isPasswordField && (
          <IconWrapper>
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Icon
                source={isPasswordVisible ? eyeOff : eye} // 아이콘을 눈 모양으로 변경
              />
            </TouchableOpacity>
          </IconWrapper>
        )}
        {withAuthButton && (
          <AuthButton onPress={onPressBtn}>
            <Text style={{color: '#fff'}}>인증 요청</Text>
          </AuthButton>
        )}
        {withCheckButton && (
          <AuthButton onPress={onPressBtn}>
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
  z-index: 1;
`;

const InputContainer = styled.View`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 5px;
`;

const ErrorText = styled.Text`
  color: red;
  font-size: 10px;
  margin-left: 5px;
  padding-bottom: 6px;
`;

const IconWrapper = styled.View`
  position: absolute;
  right: 10px; /* 오른쪽 끝에 배치 */
  top: 15px;
`;

const Icon = styled.Image`
  width: 20px;
  height: 20px;
`;
