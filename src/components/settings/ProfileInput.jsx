import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

const eye = require('../../assets/images/eye.png');
const eyeOff = require('../../assets/images/eye_off.png');

const ProfileInput = ({
  label,
  value,
  onChangeText,
  editable = true,
  placeholder,
  errorMessage,
  isPasswordField,
  secureTextEntry,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false); // 비밀번호 보이기 상태

  // 비밀번호 보이기/숨기기 토글
  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };
  return (
    <Container>
      <LabelContainer>
        <Label>{label}</Label>
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      </LabelContainer>
      <InputContainer>
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          editable={editable}
          style={{
            backgroundColor: editable ? '#fff' : '#e0e0e0',
            color: editable ? '#000000' : '#999999',
            borderColor: errorMessage ? '#DD4343' : '#c8c8c8', // 에러 메시지가 있을 때 보더 색을 빨간색으로 변경
          }} // 비활성화 시 배경 회색
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
      </InputContainer>
    </Container>
  );
};

export default ProfileInput;

const Container = styled.View``;

const Label = styled.Text`
  font-size: 12px;
  color: black;
  margin-bottom: 8px;
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #c8c8c8;
  padding: 10px;
  height: 40px;
  color: black;
  flex: 1;
`;

const ErrorText = styled.Text`
  color: #dd4343;
  font-size: 10px;
  margin-left: 5px;
  padding-bottom: 6px;
`;
const LabelContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  margin-top: 5px;
`;

const InputContainer = styled.View`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 5px;
`;

const IconWrapper = styled.View`
  position: absolute;
  right: 10px; /* 오른쪽 끝에 배치 */
  top: 11px;
`;

const Icon = styled.Image`
  width: 20px;
  height: 20px;
`;
