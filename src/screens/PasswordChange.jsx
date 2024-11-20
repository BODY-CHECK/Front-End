import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import ProfileInput from '../components/settings/ProfileInput';
import instance from '../axiosInstance';
import {Alert} from 'react-native';
import {useAuth} from '../AuthContext';
import {useNavigation} from '@react-navigation/native';

const baseURL = 'https://dev.bodycheck.store';

const PasswordChange = () => {
  const {logout} = useAuth();
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

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

  const handlePasswordChange = text => {
    setPassword(text);
    validatePassword(text); // 실시간으로 비밀번호 유효성 검사
  };

  const handleConfirmPasswordChange = text => {
    setConfirmPassword(text);
    validateConfirmPassword(text, password); // 실시간으로 비밀번호 확인 유효성 검사
  };

  const handleEdit = async () => {
    // 비밀번호 유효성 검사
    if (
      !validatePassword(password) ||
      !validateConfirmPassword(confirmPassword, password)
    ) {
      return;
    }

    try {
      const response = await instance.put(
        `${baseURL}/members/change-password`,
        {
          pw: password,
        },
      );

      if (response.data.isSuccess) {
        Alert.alert('비밀번호가 성공적으로 변경되었습니다.');
        // 로그아웃 후 로그인 페이지로 이동
        await logout();
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}], // 로그인 화면의 이름
        });
      } else {
        Alert.alert('비밀번호 변경에 실패했습니다.', response.data.message);
      }
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      Alert.alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Container>
      <ProfileInput
        label="새 비밀번호"
        placeholder="비밀번호 입력 (영문, 숫자, 특수문자 포함 8~16자)"
        isPasswordField={true}
        value={password}
        onChangeText={handlePasswordChange}
        errorMessage={errors.password}
      />
      <ProfileInput
        label="새 비밀번호 확인"
        placeholder="비밀번호 재입력"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        errorMessage={errors.confirmPassword}
      />
      <EditButton onPress={handleEdit}>
        <ButtonText>수정하기</ButtonText>
      </EditButton>
    </Container>
  );
};

export default PasswordChange;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;

const EditButton = styled.TouchableOpacity`
  background-color: #3373eb;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-top: auto;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 14px;
`;
