import styled from 'styled-components/native';
import logo from '../assets/images/logo.png';
import saveVideo from '../assets/images/saveVideo.png';
import AIRoutine from '../assets/images/AIRoutine.png';
import CompareExercise from '../assets/images/CompareExercise.png';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useState} from 'react';
import {ActivityIndicator, Alert, Modal} from 'react-native';
import instance from '../axiosInstance';
const IsPremium = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {subtitle, showCancelButton} = route.params; // 전달된 데이터
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false); // 구독 취소 완료 모달
  const [isLoading, setLoading] = useState(false);

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      const response = await instance.post('/payment/subscribe/cancel');
      if (response.status === 200 && response.data.isSuccess) {
        setModalVisible(false);
        setConfirmationVisible(true); // 확인 모달 열기
        // 구독 상태 확인 및 화면 전환
      } else {
        Alert.alert('구독 취소에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('구독 취소 오류:', error);
      Alert.alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmationVisible(false);
    navigation.replace('SubscriptionHandler'); // 구독 상태 업데이트
  };

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
          <CancelButton onPress={() => setModalVisible(true)}>
            <ButtonText>해지하기</ButtonText>
          </CancelButton>
        </FooterContainer>
      )}

      {/* 모달 */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <ModalContainer>
          <ModalContent>
            <ModalText>정말로 프리미엄 혜택을 포기하시겠습니까?</ModalText>
            <ButtonGroup>
              <ModalConfirmButton onPress={handleCancelSubscription}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <ModalButtonText>예</ModalButtonText>
                )}
              </ModalConfirmButton>
              <ModalCancelButton onPress={() => setModalVisible(false)}>
                <ModalButtonText>아니오</ModalButtonText>
              </ModalCancelButton>
            </ButtonGroup>
          </ModalContent>
        </ModalContainer>
      </Modal>
      {/* 구독 취소 완료 모달 */}
      <Modal
        transparent={true}
        visible={isConfirmationVisible}
        onRequestClose={handleCloseConfirmation}>
        <ModalContainer>
          <ModalContent>
            <ModalText>구독이 취소되었습니다.</ModalText>
            <ModalConfirmButton onPress={handleCloseConfirmation}>
              <ModalButtonText>확인</ModalButtonText>
            </ModalConfirmButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
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

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  width: 80%;
  height: 185px;
  background-color: white;
  border-radius: 5px;
  padding: 20px;
  align-items: center;
  justify-content: center;
`;

const ModalText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
  color: black;
  font-weight: bold;
`;

const ButtonGroup = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

const ModalConfirmButton = styled.TouchableOpacity`
  background-color: #3373eb;
  width: 45%;
  height: 40px;
  width: 45%;
  height: 40px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  padding: 10px ;
  margin: 0 10px 0 5px;
`;

const ModalCancelButton = styled.TouchableOpacity`
  background-color: #3c3b40;
  width: 45%;
  height: 40px;
  width: 45%;
  height: 40px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  padding: 10px ;
  margin: 0 7px 0 5px;
`;

const ModalButtonText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: white;
`;
