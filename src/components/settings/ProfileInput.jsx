import React from 'react';
import styled from 'styled-components/native';

const ProfileInput = ({
  label,
  value,
  onChangeText,
  editable = true,
  placeholder,
  errorMessage,
}) => {
  return (
    <Container>
      <LabelContainer>
        <Label>{label}</Label>
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      </LabelContainer>

      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={editable}
        style={{
          backgroundColor: editable ? '#fff' : '#e0e0e0',
          color: editable ? '#000000' : '#999999',
          borderColor: errorMessage ? 'red' : '#c8c8c8', // 에러 메시지가 있을 때 보더 색을 빨간색으로 변경
        }} // 비활성화 시 배경 회색
      />
    </Container>
  );
};

export default ProfileInput;

const Container = styled.View`
  margin-bottom: 15px;
`;

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
`;

const ErrorText = styled.Text`
  color: red;
  font-size: 10px;
  margin-left: 5px;
  padding-bottom: 6px;
`;
const LabelContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
`;
