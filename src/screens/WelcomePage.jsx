import styled from 'styled-components/native';
import logo_big from '../assets/images/logo_big.png';
import Button from '../components/signup/Button';
import {useAuth} from '../AuthContext';
import {useNavigation} from '@react-navigation/native';
const WelcomePage = () => {
  const {setIsLoggedIn} = useAuth();
  const navigation = useNavigation();

  const handleNext = () => {
    // 로그인 상태 업데이트
    setIsLoggedIn(true);
  };

  const handleNoSkip = () => {
    // Health 화면으로 이동하면서 운동 ID와 반복 횟수 전달
    navigation.navigate('Health', {
      id: 0, // 운동 번호
      repCount: 3, // 반복 횟수
    });
  };

  return (
    <Container>
      <ContentContainer>
        <WelcomeLogo source={logo_big} />
        <WelcomeTitle>환영합니다!</WelcomeTitle>
        <WelcomeMsg>BodyCheck과 함께 운동을 시작해 봅시다!</WelcomeMsg>
        <TutorialTextContainer>
          <TutorialText>
            튜토리얼 시작 시 안내음성에 맞춰 숨쉬기운동이 진행됩니다.
          </TutorialText>
          <TutorialText>양 팔을 높이 들었다가 천천히 내려주세요!</TutorialText>
        </TutorialTextContainer>
      </ContentContainer>
      <Button title="튜토리얼 시작하기" onPress={handleNoSkip} />
      <SkipTextContainer onPress={handleNext}>
        <SkipText>튜토리얼 건너뛰기</SkipText>
      </SkipTextContainer>
    </Container>
  );
};

export default WelcomePage;

const Container = styled.View`
  flex: 1;
  align-items: center;
  text-align: center;
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

const SkipTextContainer = styled.TouchableOpacity`
  border-bottom-color: gray;
  border-bottom-width: 1px;
`;

const SkipText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: gray;
`;

const TutorialText = styled.Text`
  font-size: 14px;
  text-align: center;
`;

const TutorialTextContainer = styled.View`
  margin-top: 50px;
`;
