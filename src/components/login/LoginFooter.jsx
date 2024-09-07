import React from 'react';
import styled from 'styled-components/native';
import logoKakao from '../../assets/images/logoKakao.png';
import logoGoogle from '../../assets/images/logoGoogle.png';
import {useNavigation} from '@react-navigation/native'; // React Navigation 사용

const LoginFooter = () => {
  const navigation = useNavigation();

  return (
    <FooterContainer>
      <LinksContainer>
        <LinkItem onPress={() => alert('회원가입')}>
          <LinkText>회원가입</LinkText>
        </LinkItem>
        <Divider />
        <LinkItem onPress={() => alert('비밀번호 찾기')}>
          <LinkText>비밀번호 찾기</LinkText>
        </LinkItem>
      </LinksContainer>
      <IconsContainer>
        <Icon source={logoKakao} onPress={() => alert('Kakao 로그인')} />
        <Icon source={logoGoogle} onPress={() => alert('Google 로그인')} />
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
