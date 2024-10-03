import React from 'react';
import styled from 'styled-components/native';

const days = ['월', '화', '수', '목', '금', '토', '일'];

const DaySelector = ({selectedDay, onDayChange}) => {
  return (
    <DayContainer>
      {days.map(day => (
        <DayButton
          key={day}
          selected={day === selectedDay}
          onPress={() => onDayChange(day)}>
          <DayText selected={day === selectedDay}>{day}</DayText>
        </DayButton>
      ))}
    </DayContainer>
  );
};

export default DaySelector;

const DayContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  background-color: #ccdcfa;
  width: 100%;
  height: 45px;
  border-radius: 25px;
  margin-bottom: 15px;
`;

const DayButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background-color: ${({selected}) => (selected ? '#fff' : '#CCDCFA')};
  border-radius: 20px;
  padding-bottom: 3px;
`;

const DayText = styled.Text`
  font-size: 18px;
  color: ${({selected}) => (selected ? '#000' : '#6D6D6D')};
`;
