import styled from 'styled-components';
import SignupHeader from '../../components/signup/SignupHeader';
import InputField from '../../components/signup/InputField';
import Button from '../../components/signup/Button';

const Signup2 = () => {
  return (
    <Container>
      <SignupHeader currentStep={2} />
      <InputField
        label="닉네임"
        placeholder="닉네임 입력(영문, 한글, 숫자, - , _만 포함 10자 이내)"
        withLabel
        required
      />
      <Button title="완료" />
    </Container>
  );
};

export default Signup2;

const Container = styled.View`
  flex: 1;
  padding: 20px;
  align-items: center;
  background-color: #fff;
`;
