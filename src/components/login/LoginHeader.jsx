import React from 'react';
import styled from 'styled-components/native';
import logo_big from '../../assets/images/logo_big.png';
import logo from '../../assets/images/logo.png';

const LoginHeader = () => {
  return (
    <HeaderContainer>
      <Logo source={logo} />
      <Title>BodyCheck</Title>
    </HeaderContainer>
  );
};

export default LoginHeader;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  margin-top: 60px;
`;

const Logo = styled.Image`
  width: 70px;
  height: 67px;
`;

const Title = styled.Text`
  font-size: 40px;
  font-weight: 700;
  color: #000;
  margin-left: 20px;
`;
