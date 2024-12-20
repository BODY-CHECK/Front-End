// LoginFooter.js
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import logoKakao from '../../assets/images/kakao_login_medium_wide.png';

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

  // 카카오 로그인 버튼 클릭 시 웹뷰 화면으로 이동
  const handleKakaoLogin = async () => {
    const {kakaoUrl} = await fetchSocialLoginUrls();
    if (kakaoUrl) {
      navigation.navigate('KakaoLoginWebview', {kakaoUrl}); // 웹뷰 화면으로 카카오 로그인 URL 전달
    } else {
      alert('카카오 로그인 URL을 가져오는 데 실패했습니다.');
    }
  };

  const handleGoogleLogin = async () => {
    const {googleUrl} = await fetchSocialLoginUrls();
    if (googleUrl) {
      navigation.navigate('GoogleLoginWebview', {googleUrl});
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
        <LinkItem onPress={() => navigation.navigate('ResetPassword')}>
          <LinkText>비밀번호 재발급</LinkText>
        </LinkItem>
      </LinksContainer>
      <IconsContainer>
        <TouchableOpacity onPress={handleKakaoLogin}>
          <Icon source={logoKakao} />
        </TouchableOpacity>
      </IconsContainer>
    </FooterContainer>
  );
};

export default LoginFooter;

// Styled Components
const FooterContainer = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  align-items: center;
  margin-bottom: 140px;
  position: relative;
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
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin-top: 200px;
`;

const Icon = styled.Image`
  margin: 0 15px;
  cursor: pointer;
  width: 340px;
  border-radius: 5px;
`;
