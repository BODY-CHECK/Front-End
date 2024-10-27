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
                <ExerciseImage source={exercise.imageSource} />
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
          <RoutineText>{exercise ? exercise.title : ''}</RoutineText>
        </ItemWrapper>
      ))}
    </Container>
  );
};

export default RoutineBox;

const Container = styled.View`
  width: 100%;
  height: 156px;
  border-radius: 10px;
  border-width: 0.5px;
  border-color: #999999;
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
  margin-top: 20px;
  font-size: 50px;
  color: #e5e5e5;
`;

const ExerciseImage = styled.Image`
  width: 80px;
  height: 80px;
`;

const DeleteButton = styled.TouchableOpacity`
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: black;
  border-radius: 50px;
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const DeleteText = styled.Text`
  color: white;
  font-size: 10px;
  font-weight: bold;
`;
