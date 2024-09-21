import React from 'react';
import styled from 'styled-components/native';
import logo_big from '../../assets/images/logo_big.png';

const LoginHeader = () => {
  return (
    <HeaderContainer>
      <Logo source={logo_big} />
      <Title>BodyCheck</Title>
    </HeaderContainer>
  );
};

export default LoginHeader;

const HeaderContainer = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const Logo = styled.Image`
  width: 200px;
  height: 180px;
`;

const Title = styled.Text`
  font-size: 40px;
  font-weight: 700;
  color: #000;
  margin-left: 20px;
`;
