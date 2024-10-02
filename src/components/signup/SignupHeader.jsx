import styled from 'styled-components';

const SignupHeader = ({currentStep}) => {
  const progressImage =
    currentStep === 1
      ? require('../../assets/images/progressbar_1.png')
      : require('../../assets/images/progressbar_2.png');
  return (
    <HeaderContainer>
      <Title>회원가입</Title>
      <Progressbar source={progressImage} />
    </HeaderContainer>
  );
};

export default SignupHeader;

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  margin-bottom: 30px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: black;
`;
const Progressbar = styled.Image`
  width: 70px;
  height: 30px;
`;
