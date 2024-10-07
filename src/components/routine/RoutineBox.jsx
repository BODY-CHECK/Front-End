import React from 'react';
import styled from 'styled-components/native';

const RoutineBox = ({routines, onPlusClick, isEditing, onDelete}) => {
  return (
    <Container>
      {routines.map((exercise, index) => (
        <ItemWrapper key={index}>
          <RoutineItem>
            {exercise ? (
              <>
                <ExerciseImage source={exercise.image} />
                {isEditing && (
                  <DeleteButton onPress={() => onDelete(index)}>
                    <DeleteText>X</DeleteText>
                  </DeleteButton>
                )}
              </>
            ) : (
              <PlusButton onPress={() => isEditing && onPlusClick(index)}>
                <Plus>+</Plus>
              </PlusButton>
            )}
          </RoutineItem>
          <RoutineText>{exercise ? exercise.name : '미설정'}</RoutineText>
        </ItemWrapper>
      ))}
    </Container>
  );
};

export default RoutineBox;

const Container = styled.View`
  width: 100%;
  height: 156px;
  border-radius: 15px;
  elevation: 5;
  background-color: #fff;
  margin-bottom: 30px;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const ItemWrapper = styled.View`
  flex-direction: column;
  align-items: center;
`;

const RoutineItem = styled.View`
  width: 92px;
  height: 92px;
  border-radius: 15px;
  border-width: 1px;
  border-color: #3373eb;
  background-color: #fff;
  margin-bottom: 12px;
  align-items: center;
  justify-content: center;
  padding-bottom: 5px;
`;

const RoutineText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: black;
`;

const PlusButton = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const Plus = styled.Text`
  font-size: 50px;
  color: #e5e5e5;
`;

const ExerciseImage = styled.Image`
  width: 92px;
  height: 92px;
`;

const DeleteButton = styled.TouchableOpacity`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: red;
  border-radius: 50px;
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
`;

const DeleteText = styled.Text`
  color: white;
  font-size: 12px;
`;
