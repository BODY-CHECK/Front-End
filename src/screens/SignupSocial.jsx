import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import ConfirmModal from '../components/ConfirmModal';
import AgreementCheckbox from '../components/signup/AgreementCheckbox';
import Button from '../components/signup/Button';
import GenderSelection from '../components/signup/GenderSelection';
import InputField from '../components/signup/InputField';
import SignupHeader from '../components/signup/SignupHeader';
import SizeInput from '../components/signup/SizeInput';

const baseURL = 'https://dev.bodycheck.store';

const SignupSocial = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {email} = route.params;

  const [nickname, setNickname] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [nicknameError, setNicknameError] = useState('');

  const [confirmModalVisible, setConirmModalVisible] = useState(false); // 모달 상태
  const [confirmModalMessage, setConfirmModalMessage] = useState(''); // 모달 메시지

  // 닉네임 유효성 검사 (중복 검사 제외)
  const validateNickname = nickname => {
    const nicknameRegex = /^[a-zA-Z0-9가-힣-_]+$/;
    if (nickname.length > 10) {
      setNicknameError('10자 이내로 구성해주세요');
      return false;
    }
    if (!nicknameRegex.test(nickname)) {
      setNicknameError(
        '영문 대/소문자, 한글, 숫자, 하이픈(-), 언더스코어(_)만 사용해주세요',
      );
      return false;
    }
    setNicknameError('');
    return true;
  };

  // 유효성 검사에 따라 완료 버튼 활성화 상태 업데이트
  // 유효성 검사에 따라 완료 버튼 활성화 상태 업데이트
  useEffect(() => {
    const isFormComplete =
      nickname && // 닉네임이 빈 값이 아닌지 확인
      !nicknameError && // 닉네임 유효성 오류가 없는지 확인
      gender && // 성별이 선택되었는지 확인
      height &&
      !isNaN(height) &&
      parseInt(height, 10) > 0 && // 키가 숫자이며 0보다 큰지 확인
      weight &&
      !isNaN(weight) &&
      parseInt(weight, 10) > 0 && // 몸무게가 숫자이며 0보다 큰지 확인
      isPrivacyAgreed; // 개인정보 수집 동의 체크 여부 확인

    setIsFormValid(isFormComplete);
  }, [nickname, nicknameError, gender, height, weight, isPrivacyAgreed]);

  const handleNicknameChange = text => {
    setNickname(text);
    validateNickname(text);
  };

  const handleCheckboxChange = isChecked => {
    setIsPrivacyAgreed(isChecked);
  };

  const handleHeightChange = value => {
    setHeight(value);
  };

  const handleWeightChange = value => {
    setWeight(value);
  };

  const handleNext = async () => {
    if (!isFormValid) return;

    try {
      const response = await axios.post(`${baseURL}/members/email/sign-up`, {
        nickname: nickname,
        height: parseInt(height, 10),
        weight: parseInt(weight, 10),
        gender: gender,
        email: email, // 전달받은 이메일 사용
        pw: null,
      });

      if (response.data.success) {
        setConirmModalVisible(true);
        setConfirmModalMessage('회원가입이 완료되었습니다.');
        navigation.navigate('WelcomePage');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorCode = error.response.data.code;
        if (errorCode === 'email already exists') {
          setConirmModalVisible(true);
          setConfirmModalMessage('이미 존재하는 이메일입니다.');
        } else if (errorCode === 'FRIEND4003') {
          setConirmModalVisible(true);
          setConfirmModalMessage('이미 존재하는 닉네임입니다.');
        } else {
          setConirmModalVisible(true);
          setConfirmModalMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        console.log(error);
        console.log(error.response.data);
        alert(
          '서버와의 통신 중 문제가 발생했습니다. 나중에 다시 시도해주세요.',
        );
      }
    }
  };

  return (
    <Container>
      <SignupHeader />
      <InputField
        label="닉네임"
        placeholder="닉네임 입력(영문, 한글, 숫자, - , _만 포함 10자 이내)"
        withLabel
        required
        value={nickname}
        onChangeText={handleNicknameChange}
        errorMessage={nicknameError} // 닉네임 유효성 검사 메시지 표시
      />
      <GenderSelection value={gender} onChange={setGender} />
      <SizeInput
        onHeightChange={handleHeightChange}
        onWeightChange={handleWeightChange}
      />
      <CheckboxContainer>
        <AgreementCheckbox
          label="개인정보 수집 및 이용동의"
          required
          onValueChange={handleCheckboxChange}
        />
      </CheckboxContainer>
      <Button title="완료" onPress={handleNext} disabled={!isFormValid} />
      <ConfirmModal
        visible={confirmModalVisible}
        message={confirmModalMessage}
        onConfirm={() => setConirmModalVisible(false)}
      />
    </Container>
  );
};

export default SignupSocial;

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #fff;
  align-items: center;
`;

const CheckboxContainer = styled.View`
  width: 100%;
  align-items: flex-start;
  margin-top: 180px;
`;
