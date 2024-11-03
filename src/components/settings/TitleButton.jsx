import React from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';

function TitleButton({title, onPress}) {
  return (
    <ButtonContainer onPress={onPress}>
      <ButtonText>{title}</ButtonText>
      <Arrow>›</Arrow>
    </ButtonContainer>
  );
}

export default TitleButton;

// 스타일드 컴포넌트
const ButtonContainer = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  color: #1c1b1f;
`;

const Arrow = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #888;
`;
