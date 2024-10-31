import React from 'react';
import styled from 'styled-components/native';
import logoKakao from '../../assets/images/logo_kakao.png';
import logoGoogle from '../../assets/images/logoGoogle.png';
import {useNavigation} from '@react-navigation/native'; // React Navigation 사용
import {Linking, TouchableOpacity} from 'react-native'; // Linking 모듈 가져오기

const LoginFooter = () => {
  const navigation = useNavigation();

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
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://kauth.kakao.com/oauth/authorize')
          }>
          <Icon source={logoKakao} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=700912738985-popejm8k41ejrfd0bgvsvf51jj1nvt8s.apps.googleusercontent.com&redirect_uri=http://localhost:8080/login/oauth2/code/google&scope=email profile',
            )
          }>
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
