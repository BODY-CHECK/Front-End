import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import SignupHeader from '../components/signup/SignupHeader';
import InputField from '../components/signup/InputField';
import Button from '../components/signup/Button';
import GenderSelection from '../components/signup/GenderSelection';
import SizeInput from '../components/signup/SizeInput';
import AgreementCheckbox from '../components/signup/AgreementCheckbox';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import {Modal, TouchableOpacity, Text} from 'react-native';

const baseURL = 'https://dev.bodycheck.store';

const Signup2 = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Signup1에서 전달된 이메일과 패스워드를 추출
  const {email, password} = route.params;

  const [nickname, setNickname] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [nicknameError, setNicknameError] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedParts, setSelectedParts] = useState([]);

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
    setIsModalVisible(true); // 모달 띄우기
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${baseURL}/members/email/sign-up`, {
        nickname: nickname,
        height: parseInt(height, 10),
        weight: parseInt(weight, 10),
        gender: gender,
        email: email, // 전달받은 이메일 사용
        pw: password, // 전달받은 패스워드 사용
        preferredParts: selectedParts, // 선택된 운동 부위 추가
      });

      if (response.data.success) {
        alert('회원가입이 완료되었습니다.');
        navigation.navigate('WelcomePage');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorCode = error.response.data.code;
        if (errorCode === 'email already exists') {
          alert('이미 존재하는 이메일입니다.');
        } else if (errorCode === 'FRIEND4003') {
          alert('이미 존재하는 닉네임입니다.');
        } else {
          alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        console.log(error);
        alert(
          '서버와의 통신 중 문제가 발생했습니다. 나중에 다시 시도해주세요.',
        );
      }
    }
  };
  

  return (
    <Container>
      <SignupHeader currentStep={2} />
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

      {/* 모달 UI */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <ModalContainer>
          <ModalContent>
            <ModalTitle>운동 중에서 특히 어느 부위를 선호하나요?</ModalTitle>
            <PartList>
              <PartItem
                selected={selectedParts.includes('상체')}
                onPress={() => togglePartSelection('상체')}
              >
                <PartText>상체</PartText>
              </PartItem>
              <PartItem
                selected={selectedParts.includes('하체')}
                onPress={() => togglePartSelection('하체')}
              >
                <PartText>하체</PartText>
              </PartItem>
            </PartList>
            <SubmitButton onPress={handleSubmit}>
              <SubmitButtonText>완료</SubmitButtonText>
            </SubmitButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

export default Signup2;

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

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  width: 80%;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
`;

const ModalTitle = styled.Text`
  font-size: 16px;
  margin-bottom: 20px;
  font-weight: bold;
  text-align: center;
`;

const PartList = styled.View`
  width: 100%;
  margin-bottom: 20px;
`;

const PartItem = styled.TouchableOpacity`
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  border-radius: 5px;
  align-items: center;
  background-color: ${({selected}) => (selected ? '#3373EB' : '#fff')};
`;

const PartText = styled.Text`
  color: ${({selected}) => (selected ? '#fff' : '#000')};
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #3373EB;
  padding: 10px 20px;
  border-radius: 5px;
`;

const SubmitButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;