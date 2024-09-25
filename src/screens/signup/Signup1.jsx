import React from 'react';
import styled from 'styled-components';
import SignupHeader from '../../components/signup/SignupHeader';
import InputField from '../../components/signup/InputField';
import Button from '../../components/signup/Button';

function Signup1() {
  return (
    <Container>
      <SignupHeader />
      <InputField
        label="이메일"
        placeholder="email@example.com"
        withLabel
        required
        withAuthButton
      />
      <InputField placeholder="인증번호 입력" withCheckButton />
      <InputField
        label="비밀번호"
        placeholder="비밀번호 입력 (영문, 숫자, 특수문자 포함 8~16자)"
        withLabel
        required
      />
      <InputField
        label="비밀번호 확인"
        placeholder="비밀번호 재입력"
        withLabel
        required
      />
      <Button title="다음" />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 20px;
  align-items: center;
  background-color: #fff;
`;

export default Signup1;
