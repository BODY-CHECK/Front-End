import React from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import TitleButton from '../components/settings/TitleButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../AuthContext';
import {Alert} from 'react-native';

function SettingsScreen() {
  const navigation = useNavigation();
  const {setIsLoggedIn} = useAuth();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      setIsLoggedIn(false); // 로그아웃 상태로 전환
      Alert.alert('로그아웃 되었습니다.');
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
      <TitleButton title="로그아웃" onPress={handleLogout} />
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
