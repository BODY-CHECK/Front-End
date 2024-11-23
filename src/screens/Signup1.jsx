import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import SignupHeader from '../components/signup/SignupHeader';
import InputField from '../components/signup/InputField';
import Button from '../components/signup/Button';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import ConfirmModal from '../components/ConfirmModal';

const baseURL = 'https://dev.bodycheck.store';

function Signup1() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isAuthVerified, setAuthVerified] = useState(false); // 인증 성공 여부
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태
  const [modalMessage, setModalMessage] = useState(''); // 모달 메시지

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors(prev => ({...prev, email: '이메일 형식으로 입력해주세요'}));
      return false;
    }
    setErrors(prev => ({...prev, email: ''}));
    return true;
  };

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

  // "다음" 버튼 활성화 조건을 useEffect로 관리
  useEffect(() => {
    if (
      isAuthVerified &&
      validatePassword(password) &&
      validateConfirmPassword(confirmPassword, password)
    ) {
      setIsNextButtonEnabled(true);
    } else {
      setIsNextButtonEnabled(false);
    }
  }, [isAuthVerified, password, confirmPassword]); // 종속성 배열에 필요한 상태를 넣음

  const handleNext = () => {
    if (isNextButtonEnabled) {
      navigation.navigate('SignUp2', {email, password});
    }
  };

  const handleAuthButtonClick = async () => {
    try {
      const response = await axios.post(
        `${baseURL}/members/emails/send-verification-code`,
        {
          email: email,
        },
      );
      if (response.data.success) {
        setModalMessage('인증번호가 이메일로 전송되었습니다.');
        setModalVisible(true);
      } else {
        setModalMessage('인증번호 전송에 실패했습니다. 다시 시도해주세요.');
        setModalVisible(true);
      }
    } catch (error) {
      setModalMessage(
        '서버와의 통신 중 문제가 발생했습니다. 나중에 다시 시도해주세요.',
      );
      setModalVisible(true);
    }
  };

  const handleAuthCodeVerification = async () => {
    try {
      const response = await axios.post(
        `${baseURL}/members/emails/verify-code`,
        {email: email, code: authCode},
      );
      if (response.data.success) {
        setModalMessage('인증이 완료되었습니다.');
        setModalVisible(true);
        setAuthVerified(true);
      } else {
        setModalMessage('인증번호가 올바르지 않습니다. 다시 시도해주세요.');
        setModalVisible(true);
        setAuthVerified(false);
      }
    } catch (error) {
      setModalMessage(
        '서버와의 통신 중 문제가 발생했습니다. 나중에 다시 시도해주세요.',
      );
      setModalVisible(true);
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
        onPressBtn={handleAuthButtonClick}
      />
      <InputField
        placeholder="인증번호 입력"
        value={authCode}
        onChangeText={setAuthCode}
        withCheckButton
        onPressBtn={handleAuthCodeVerification}
      />
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
      <Button
        title="다음"
        onPress={handleNext}
        disabled={!isNextButtonEnabled}
      />
      <ConfirmModal
        visible={modalVisible}
        message={modalMessage}
        onConfirm={() => setModalVisible(false)}
      />
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
