import styled from 'styled-components/native';
import logo from '../assets/images/logo.png';
import {Alert, Linking, Modal} from 'react-native';
import instance from '../axiosInstance';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';

const baseURL = 'https://dev.bodycheck.store';

const PremiumUpgrade = () => {
  const [modalVisible, setModalVisible] = useState(false);

  // 구독하기 버튼 클릭 시 호출되는 함수
  const handleSubscribe = async () => {
    try {
      const response = await instance.post(`${baseURL}/payment/ready`);
      if (response.status === 200 && response.data.isSuccess) {
        const redirectUrl = response.data.result.next_redirect_mobile_url;
        Linking.openURL(redirectUrl);
        // 일정 시간 후에 모달을 표시
        setTimeout(() => {
          setModalVisible(true);
        }, 5000); // 1초 딜레이 (필요한 시간으로 조정 가능)      } else {
        Alert.alert('결제 준비에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('결제 준비 API 호출 오류:', error);
      Alert.alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Container>
      <TitleContainer>
        <TitleWrapper>
          <Logo source={logo} />
          <Title>BodyCheck Premium</Title>
        </TitleWrapper>
        <SubTitle>꾸준히 운동하여 성공적인 운동 습관을</SubTitle>
        <SubTitle>만들어보세요!</SubTitle>
      </TitleContainer>
      <FeatureContainer>
        <FeatureItem>
          <FeatureTitle>영상 저장</FeatureTitle>
          <FeatureDescription>
            운동 영상을 저장하여 자세를 효과적으로 교정해보세요.
          </FeatureDescription>
          <FeatureItem />
          <FeatureItem>
            <FeatureTitle>AI 루틴 추천</FeatureTitle>
            <FeatureDescription>
              AI와 함께 나에게 잘 맞는 효과적인 루틴을 만들어보세요.
            </FeatureDescription>
          </FeatureItem>
          <FeatureItem>
            <FeatureTitle>운동 자세 비교</FeatureTitle>
            <FeatureDescription>
              유명 유튜버와 함께 자세를 비교하며 재미있게 운동해 보세요.
            </FeatureDescription>
          </FeatureItem>
        </FeatureItem>
      </FeatureContainer>
      <PriceText>월/4,900₩</PriceText>
      <SubscribeButton onPress={handleSubscribe}>
        <ButtonText>구독하기</ButtonText>
      </SubscribeButton>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <ModalContainer>
          <ModalContent>
            <ModalText>결제가 완료되었습니다</ModalText>
            <ConfirmButton onPress={() => setModalVisible(false)}>
              <ConfirmButtonText>확인</ConfirmButtonText>
            </ConfirmButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

export default PremiumUpgrade;

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: #fff;
  padding: 20px;
`;
const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  width: 80%;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  align-items: center;
`;

const ModalText = styled.Text`
  font-size: 18px;
  margin-bottom: 15px;
  color: black;
`;

const ConfirmButton = styled.TouchableOpacity`
  background-color: #3373eb;
  padding: 10px 20px;
  border-radius: 5px;
`;

const ConfirmButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;

const TitleContainer = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

const TitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 30px;
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
  font-size: 20px;
  color: #8c96ab;
`;

const FeatureContainer = styled.View`
  flex-direction: column;
  margin-top: 40px;
`;

const FeatureItem = styled.View`
  flex-direction: column;
  margin-bottom: 20px;
`;

const FeatureTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: black;
`;

const FeatureDescription = styled.Text`
  font-size: 15px;
  color: #8c96ab;
  margin-top: 10px;
`;

const SubscribeButton = styled.TouchableOpacity`
  background-color: #3373eb;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-top: auto;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 14px;
`;

const PriceText = styled.Text`
  font-size: 35px;
  font-weight: 700;
  color: black;
  text-align: center;
  margin-top: 15px;
`;
