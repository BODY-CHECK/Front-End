import React from 'react';
import {Button} from 'react-native';
import styled from 'styled-components';

function Home({setIsLoggedIn}) {
  return (
    <Container>
      <HomeText>Home</HomeText>
      <Button title="Logout" onPress={() => setIsLoggedIn(false)} />
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
