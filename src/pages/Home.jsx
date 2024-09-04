import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import styled from 'styled-components';

function Home() {
  return (
    <Container>
      <HomeText>Home</HomeText>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
`;

const HomeText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

export default Home;
