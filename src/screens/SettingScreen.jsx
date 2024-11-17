import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import TitleButton from '../components/settings/TitleButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../AuthContext';
import {Alert, Modal} from 'react-native';

function SettingsScreen() {
  const navigation = useNavigation();
  const {setIsLoggedIn} = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      setIsLoggedIn(false); // 로그아웃 상태로 전환
      Alert.alert('로그아웃 되었습니다.');
      setModalVisible(false);
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <Container>
      <SectionTitle>내 정보</SectionTitle>
      <TitleButton
        title="프로필 수정"
        onPress={() => navigation.navigate('ProfileEdit')}
      />
      <TitleButton
        title="비밀번호 변경"
        onPress={() => navigation.navigate('PasswordChange')}
      />
      <SectionTitle>설정</SectionTitle>
      <TitleButton
        title="프리미엄 업그레이드"
        onPress={() => navigation.navigate('PremiumUpgrade')}
      />
      <TitleButton title="로그아웃" onPress={() => setModalVisible(true)} />
      {/* 모달 컴포넌트 */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <ModalContainer>
          <ModalView>
            <ModalText>로그아웃 하시겠습니까?</ModalText>
            <ButtonContainer>
              <ConfirmButton onPress={handleLogout}>
                <ButtonText style={{color: '#fff'}}>확인</ButtonText>
              </ConfirmButton>
              <CancelButton onPress={() => setModalVisible(false)}>
                <ButtonText>취소</ButtonText>
              </CancelButton>
            </ButtonContainer>
          </ModalView>
        </ModalContainer>
      </Modal>
    </Container>
  );
}

export default SettingsScreen;

// 스타일드 컴포넌트
const Container = styled.ScrollView`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 14px;
  color: #888;
  margin-top: 20px;
  margin-bottom: 10px;
`;
const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* 배경 투명도 조절 */
`;

const ModalView = styled.View`
  width: 80%;
  height: 185px;
  background-color: white;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;

const ModalText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
  color: black;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

const ConfirmButton = styled.TouchableOpacity`
  background-color: #3373eb;
  width: 40%;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  padding: 5px 0;
`;

const CancelButton = styled.TouchableOpacity`
  background-color: #3c3b40;
  width: 40%;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: white;
`;
