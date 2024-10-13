import React from 'react';
import styled from 'styled-components/native';

const ExerciseCard = () => {
  return (
    <CardContainer>
      <Card>
        <CardImage source={require('../../assets/images/healthbaby.png')} />
      </Card>
      <Card>
        <CardImage source={require('../../assets/images/healthgosu.png')} />
      </Card>
    </CardContainer>
  );
};

export default ExerciseCard;

const CardContainer = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
`;

const Card = styled.TouchableOpacity`
  width: 160px;
  height: 160px;
  border-radius: 10px;
  background-color: #fff;
  align-items: center;
`;

const CardImage = styled.Image`
  width: 100%;
  height: 100%;
`;
