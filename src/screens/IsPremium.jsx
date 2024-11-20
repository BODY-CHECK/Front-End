import styled from 'styled-components/native';
import logo from '../assets/images/logo.png';
import saveVideo from '../assets/images/saveVideo.png';
import AIRoutine from '../assets/images/AIRoutine.png';
import CompareExercise from '../assets/images/CompareExercise.png';
import {useRoute} from '@react-navigation/native';
const IsPremium = () => {
  const route = useRoute();
  const {subtitle, showCancelButton} = route.params; // 전달된 데이터

  return (
    <Container>
      <TitleContainer>
        <User>회원</User>
        <TitleWrapper>
          <Logo source={logo} />
          <Title>BodyCheck Premium</Title>
        </TitleWrapper>
        <SubTitle>{subtitle}</SubTitle>
      </TitleContainer>
      <BenefitContainer>
        <BenefitTitle>회원님이 누리고 있는 혜택</BenefitTitle>
        <BenefitBox>
          <FeatureItem>
            <FeatureIcon source={saveVideo} />
            <FeatureTitle>영상 저장</FeatureTitle>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon source={AIRoutine} />
            <FeatureTitle>AI 루틴 추천</FeatureTitle>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon source={CompareExercise} />
            <FeatureTitle>운동 자세 비교</FeatureTitle>
          </FeatureItem>
        </BenefitBox>
      </BenefitContainer>
      {showCancelButton && ( // 해지하기 버튼 조건부 렌더링
        <FooterContainer>
          <CancelButton>
            <ButtonText>해지하기</ButtonText>
          </CancelButton>
        </FooterContainer>
      )}
    </Container>
  );
};

export default IsPremium;

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: #fff;
  padding: 20px;
`;

const User = styled.Text`
  margin-top: 20px;
  font-size: 11px;
  color: #3373eb;
  background-color: #ccdcfa;
  padding: 1px 4px 4px 4px;
  border-radius: 5px;
  text-align: center;
`;

const TitleContainer = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

const TitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const Logo = styled.Image`
  width: 70px;
  height: 67px;
`;

const Title = styled.Text`
  margin-left: 10px;
  font-size: 32px;
  font-weight: 600;
  color: black;
`;

const SubTitle = styled.Text`
  font-size: 16px;
  color: #8c96ab;
`;

const BenefitContainer = styled.View`
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const BenefitTitle = styled.Text`
  font-size: 16px;
  margin-bottom: 20px;
  color: black;
  font-weight: 500;
  text-decoration: underline;
`;

const BenefitBox = styled.View`
  border-width: 0.5px;
  border-color: #c8c8c8;
  padding: 25px 20px 0 20px;
  width: 100%;
`;

const FeatureItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 25px;
`;

const FeatureIcon = styled.Image`
  width: 40px;
  height: 40px;
`;

const FeatureTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
  margin-left: 10px;
  color: black;
`;

const FooterContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: auto;
`;

const CancelButton = styled.TouchableOpacity`
  background-color: #fff;
  height: 32px;
  width: 130px;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: #c8c8c8;
  margin-top: auto;
`;

const ButtonText = styled.Text`
  color: black;
  font-size: 12px;
`;
