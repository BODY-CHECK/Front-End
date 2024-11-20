import styled from "styled-components/native";
import logo from '../assets/images/logo.png';
import saveVideo from '../assets/images/saveVideo.png'
import AIRoutine from '../assets/images/AIRoutine.png'
import CompareExercise from '../assets/images/CompareExercise.png'
const IsPremium = () => {
  return(
    <Container>
      <TitleContainer>
        <User>회원</User>
        <TitleWrapper>
          <Logo source={logo} />
          <Title>BodyCheck Premium</Title>
        </TitleWrapper>
        <SubTitle>다음 결제 예정일은 2024년 11월 10일 입니다.</SubTitle>
      </TitleContainer>
        <BenefitContainer>
          <BenefitTitle>회원님이 누리고 있는 혜택</BenefitTitle>
          <BenefitBox>
            <FeatureItem>
              <FeatureIcon source={saveVideo}/>
              <FeatureTitle>영상 저장</FeatureTitle>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon source={AIRoutine}/>
              <FeatureTitle>AI 루틴 추천</FeatureTitle>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon source={CompareExercise}/>
              <FeatureTitle>운동 자세 비교</FeatureTitle>
            </FeatureItem>
          </BenefitBox>
        </BenefitContainer>
        <FooterContainer>
        <CancleButton>
        <ButtonText>해지하기</ButtonText>
      </CancleButton>
        </FooterContainer>
    </Container>
  )
}

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
  color: #3373EB;
  background-color: #CCDCFA;
  padding: 1px 4px 4px 4px;
  border-radius: 5px;
  text-align:center;
`

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
`

const BenefitTitle = styled.Text`
  font-size: 16px;
  margin-bottom: 10px;
  color: black;
  font-weight: 500;
  text-decoration: underline;
`

const BenefitBox = styled.View`
  border-width: 0.5px;
  border-color: #c8c8c8;
  padding: 15px 15px 0 15px;
  width: 100%;
`

const FeatureItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`

const FeatureIcon = styled.Image`
  width: 40px;
  height: 40px;
`

const FeatureTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: black;
`;

const FooterContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: auto;
`;

const CancleButton = styled.TouchableOpacity`
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