import styled from 'styled-components';
import SignupHeader from '../../components/signup/SignupHeader';
import InputField from '../../components/signup/InputField';
import Button from '../../components/signup/Button';
import GenderSelection from '../../components/signup/GenderSelection';
import SizeInput from '../../components/signup/SizeInput';
import AgreementCheckbox from '../../components/signup/AgreementCheckbox';
import {useNavigation} from '@react-navigation/native';

const Signup2 = () => {
  const navigation = useNavigation();

  const handleCheckboxChange = isChecked => {
    console.log('Checkbox is checked', isChecked);
  };

  const handleNext = () => {
    navigation.navigate('WelcomePage');
  };

  return (
    <Container>
      <SignupHeader currentStep={2} />
      <InputField
        label="닉네임"
        placeholder="닉네임 입력(영문, 한글, 숫자, - , _만 포함 10자 이내)"
        withLabel
        required
      />
      <GenderSelection />
      <SizeInput />
      <CheckboxContainer>
        <AgreementCheckbox
          label="개인정보 수집 및 이용동의"
          required
          onValueChange={handleCheckboxChange}
        />
        <AgreementCheckbox
          label="서비스 이용약관 동의"
          required
          onValueChange={handleCheckboxChange}
        />
      </CheckboxContainer>
      <Button title="완료" onPress={handleNext} />
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
  align-items: flex-start; /* 왼쪽 정렬 */
  margin-top: 150px;
`;
