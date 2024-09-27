import styled from 'styled-components/native';
import logo_big from '../../assets/images/logo_big.png';
import Button from '../../components/signup/Button';
import {useNavigation} from '@react-navigation/native';
const WelcomePage = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('Login');
  };
  return (
    <Container>
      <ContentContainer>
        <WelcomeLogo source={logo_big} />
        <WelcomeTitle>환영합니다!</WelcomeTitle>
        <WelcomeMsg>BodeCheck과 함께 운동을 시작해 봅시다!</WelcomeMsg>
      </ContentContainer>
      <Button title="BodyCheck 시작하기" onPress={handleNext} />
    </Container>
  );
};

export default WelcomePage;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 20px;
`;

const ContentContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding-top: 250px;
`;

const WelcomeLogo = styled.Image`
  width: 120px;
  height: 108px;
  margin-bottom: 15px;
`;

const WelcomeTitle = styled.Text`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #000;
`;

const WelcomeMsg = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #000;
`;
