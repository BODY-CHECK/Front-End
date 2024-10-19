import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import SignupHeader from '../components/signup/SignupHeader';
import InputField from '../components/signup/InputField';
import Button from '../components/signup/Button';
import {useNavigation} from '@react-navigation/native';

function Signup1() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors(prev => ({...prev, email: '이메일 형식으로 입력해주세요'}));
      return false;
    }
    // 이메일 중복 확인 로직 추가 필요
    setErrors(prev => ({...prev, email: ''}));
    return true;
  };

  // 비밀번호 유효성 검사
  const validatePassword = password => {
    if (password.length < 8 || password.length > 16) {
      setErrors(prev => ({...prev, password: '8~16자로 구성해주세요'}));
    } else if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      setErrors(prev => ({
        ...prev,
        password: '영문 대/소문자, 숫자, 특수문자를 각 1자 이상 사용해주세요',
      }));
      return false;
    } else {
      setErrors(prev => ({...prev, password: ''}));
      return true;
    }
  };

  // 비밀번호 확인 유효성 검사
  const validateConfirmPassword = (newConfirmPassword, newPassword) => {
    if (newPassword !== newConfirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: '비밀번호가 일치하지 않습니다.',
      }));
      return false;
    }
    setErrors(prev => ({...prev, confirmPassword: ''}));
    return true;
  };

  const handleEmailChange = text => {
    setEmail(text);
    validateEmail(text); // 실시간으로 이메일 유효성 검사
  };

  const handlePasswordChange = text => {
    setPassword(text);
    validatePassword(text); // 실시간으로 비밀번호 유효성 검사
  };

  const handleConfirmPasswordChange = text => {
    setConfirmPassword(text);
    validateConfirmPassword(text, password); // 실시간으로 비밀번호 확인 유효성 검사
  };

  const handleNext = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(
      confirmPassword,
      password,
    );

    if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      navigation.navigate('SignUp2');
    }
  };

  return (
    <Container>
      <SignupHeader currentStep={1} />
      <InputField
        label="이메일"
        placeholder="email@example.com"
        withLabel
        required
        value={email}
        onChangeText={handleEmailChange}
        errorMessage={errors.email}
        withAuthButton
      />
      <InputField placeholder="인증번호 입력" withCheckButton />
      <InputField
        label="비밀번호"
        placeholder="비밀번호 입력 (영문, 숫자, 특수문자 포함 8~16자)"
        withLabel
        required
        value={password}
        onChangeText={handlePasswordChange}
        errorMessage={errors.password}
        isPasswordField={true}
      />
      <InputField
        label="비밀번호 확인"
        placeholder="비밀번호 재입력"
        withLabel
        required
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        errorMessage={errors.confirmPassword}
        secureTextEntry={true}
      />
      <Button title="다음" onPress={handleNext} />
    </Container>
  );
}

export default Signup1;

const Container = styled.View`
  flex: 1;
  padding: 20px;
  align-items: center;
  background-color: #fff;
`;
