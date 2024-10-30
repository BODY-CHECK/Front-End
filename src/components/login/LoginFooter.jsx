import React from 'react';
import styled from 'styled-components/native';
import logoKakao from '../../assets/images/logo_kakao.png';
import logoGoogle from '../../assets/images/logoGoogle.png';
import {useNavigation} from '@react-navigation/native'; // React Navigation 사용
import {Linking, TouchableOpacity} from 'react-native'; // Linking 모듈 가져오기
import axios from 'axios';

const baseURL = 'https://dev.bodycheck.store';

const LoginFooter = () => {
  const navigation = useNavigation();

  // 소셜 로그인 URL을 가져오는 함수
  const fetchSocialLoginUrls = async () => {
    try {
      const response = await axios.get(`${baseURL}/login/oauth2`);
      if (response.data.isSuccess) {
        return {
          kakaoUrl: response.data.result.locationKakao,
          googleUrl: response.data.result.locationGoogle,
        };
      }
    } catch (error) {
      console.error('Error fetching social login URLs:', error);
    }
    return {};
  };

  // 각 버튼 클릭 시 해당 URL로 이동
  const handleKakaoLogin = async () => {
    const {kakaoUrl} = await fetchSocialLoginUrls();
    if (kakaoUrl) {
      Linking.openURL(kakaoUrl);
    } else {
      alert('카카오 로그인 URL을 가져오는 데 실패했습니다.');
    }
  };

  const handleGoogleLogin = async () => {
    const {googleUrl} = await fetchSocialLoginUrls();
    if (googleUrl) {
      Linking.openURL(googleUrl);
    } else {
      alert('구글 로그인 URL을 가져오는 데 실패했습니다.');
    }
  };

  return (
    <FooterContainer>
      <LinksContainer>
        <LinkItem onPress={() => navigation.navigate('SignUp')}>
          <LinkText>회원가입</LinkText>
        </LinkItem>
        <Divider />
        <LinkItem onPress={() => alert('비밀번호 찾기')}>
          <LinkText>비밀번호 찾기</LinkText>
        </LinkItem>
      </LinksContainer>
      <IconsContainer>
        <TouchableOpacity onPress={handleKakaoLogin}>
          <Icon source={logoKakao} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGoogleLogin}>
          <Icon source={logoGoogle} />
        </TouchableOpacity>
      </IconsContainer>
    </FooterContainer>
  );
};

export default LoginFooter;

const FooterContainer = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  align-items: center;
`;

const LinksContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
`;

const LinkItem = styled.TouchableOpacity`
  padding-left: 10px;
`;

const LinkText = styled.Text`
  font-size: 14px;
  color: #1c1b1f;
`;

const Divider = styled.View`
  height: 90%;
  margin-left: 10px;
  margin-top: 2.5px;
  width: 1px;
  background-color: #999999;
`;

const IconsContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin-top: 80px;
`;

const Icon = styled.Image`
  width: 50px;
  height: 50px;
  margin: 0 15px;
  cursor: pointer;
`;
