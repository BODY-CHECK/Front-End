import React from 'react';
import {Image, Text, View} from 'react-native';
import styled from 'styled-components/native';

const HeaderMain = () => {
  return (
    <HeaderContainer>
      <Logo source={require('../assets/images/logo.png')} />
      <Title>BodyCheck</Title>
    </HeaderContainer>
  );
};

export default HeaderMain;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  height: 50px;
`;

const Logo = styled.Image`
  width: 42px;
  height: 40px;
`;
const Title = styled.Text`
  font-size: 24px;
  color: black;
  font-weight: 700;
  margin-left: 10px;
`;
