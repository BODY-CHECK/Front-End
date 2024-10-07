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
  justify-content: space-between;
  margin-top: 20px;
`;

const Card = styled.TouchableOpacity`
  width: 50%;
  height: 190px;
  border-radius: 10px;
  background-color: #fff;
  align-items: center;
`;

const CardImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const CardText = styled.Text`
  margin-top: 10px;
  font-size: 14px;
  color: #000;
`;
