import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Alert, Modal} from 'react-native';
import styled from 'styled-components/native';
import {useAuth} from '../AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import AgreementCheckbox from '../components/signup/AgreementCheckbox';
import Button from '../components/signup/Button';
import GenderSelection from '../components/signup/GenderSelection';
import InputField from '../components/signup/InputField';
import SignupHeader from '../components/signup/SignupHeader';
import SizeInput from '../components/signup/SizeInput';

const baseURL = 'https://dev.bodycheck.store';

const Signup2 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {setIsLoggedIn} = useAuth(); // 로그인 상태 업데이트

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
  const [selectedPart, setSelectedPart] = useState(null);

  const [confirmModalVisible, setConirmModalVisible] = useState(false); // 모달 상태
  const [confirmModalMessage, setConfirmModalMessage] = useState(''); // 모달 메시지

  const handleBack = () => {
    setIsModalVisible(false); // 모달 닫기
  };

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
      // 요청 데이터 확인
      const requestData = {
        nickname: nickname,
        height: parseInt(height, 10),
        weight: parseInt(weight, 10),
        gender: gender,
        email: email,
        pw: password,
        exerciseType: selectedPart,
      };

      console.log('Request Data:', requestData); // 요청 데이터 확인

      const response = await axios.post(
        `${baseURL}/members/email/sign-up`,
        requestData,
      );

      if (response.data.success) {
        const {accessToken, refreshToken} = response.data.result;
        await AsyncStorage.setItem('accessToken', accessToken); // 토큰 저장
        await AsyncStorage.setItem('refreshToken', refreshToken);

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
        console.log('Error Response:', error.response.data);
        console.log('Error Status:', error.response.status);
        console.log('Error Headers:', error.response.headers);
        Alert.alert(
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
        required
      />
      <CheckboxContainer>
        <AgreementCheckbox
          label="개인정보 수집 및 이용동의"
          required
          onValueChange={handleCheckboxChange}
        />
      </CheckboxContainer>
      <Button title="완료" onPress={handleNext} disabled={!isFormValid} />

      {/* 모달 */}
      <Modal visible={isModalVisible} transparent={true}>
        <ModalOverlay>
          <ModalContent>
            <Header>
              <BackButton onPress={handleBack}>
                <BackButtonText>x</BackButtonText>
              </BackButton>
            </Header>
            <Body>
              <ModalTitle>
                운동 중에서{'\n'}특히 어느 부위를 더 선호하나요?
              </ModalTitle>
              <Option onPress={() => setSelectedPart('UPPER_BODY')}>
                <RadioContainer>
                  <RadioOuter>
                    {selectedPart === 'UPPER_BODY' && <RadioInner />}
                  </RadioOuter>
                </RadioContainer>
                <OptionText>상체</OptionText>
              </Option>
              <Option onPress={() => setSelectedPart('LOWER_BODY')}>
                <RadioContainer>
                  <RadioOuter>
                    {selectedPart === 'LOWER_BODY' && <RadioInner />}
                  </RadioOuter>
                </RadioContainer>
                <OptionText>하체</OptionText>
              </Option>
              <Option onPress={() => setSelectedPart(null)}>
                <RadioContainer>
                  <RadioOuter>
                    {selectedPart === null && <RadioInner />}
                  </RadioOuter>
                </RadioContainer>
                <OptionText>밸런스</OptionText>
              </Option>
              <ConfirmButton
                disabled={selectedPart === undefined} // 선택되지 않았을 때만 비활성화
                onPress={handleSubmit}
                active={selectedPart !== undefined}>
                <ConfirmButtonText>확인</ConfirmButtonText>
              </ConfirmButton>
            </Body>
          </ModalContent>
        </ModalOverlay>
      </Modal>
      <ConfirmModal
        visible={confirmModalVisible}
        message={confirmModalMessage}
        onConfirm={() => setConirmModalVisible(false)}
      />
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

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  background-color: white;
  width: 90%;
  border-radius: 5px;
  padding: 10px;
`;

const Header = styled.View`
  justify-content: flex-end;
`;

const BackButton = styled.TouchableOpacity`
  padding: 5px 10px;
`;

const BackButtonText = styled.Text`
  font-size: 18px;
  color: gray;
`;

const Body = styled.View`
  align-items: center;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: black;
  text-align: center;
  margin-bottom: 20px;
`;

const Option = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
`;

const RadioContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

const RadioOuter = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: 2px solid #3373eb;
  justify-content: center;
  align-items: center;
`;

const RadioInner = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #3373eb;
`;

const OptionText = styled.Text`
  text-align: center;
  font-size: 16px;
  color: ${({selected}) => (selected ? '#fff' : '#000')};
`;

const ConfirmButton = styled.TouchableOpacity`
  width: 100%;
  padding: 15px;
  border-radius: 10px;
  margin-top: 30px;
  background-color: ${({active}) => (active ? '#3373eb' : '#ccc')};
`;

const ConfirmButtonText = styled.Text`
  font-size: 16px;
  color: white;
  text-align: center;
`;
