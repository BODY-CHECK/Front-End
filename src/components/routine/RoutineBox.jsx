import styled from 'styled-components/native';

const RoutineBox = ({onPlusClick}) => {
  return (
    <Container>
      <ItemWrapper>
        <RoutineItem>
          <PlusButton onPress={onPlusClick}>
            <Plus>+</Plus>
          </PlusButton>
        </RoutineItem>
        <RoutineText>미설정</RoutineText>
      </ItemWrapper>
      <ItemWrapper>
        <RoutineItem>
          <PlusButton onPress={onPlusClick}>
            <Plus>+</Plus>
          </PlusButton>
        </RoutineItem>
        <RoutineText>미설정</RoutineText>
      </ItemWrapper>
      <ItemWrapper>
        <RoutineItem>
          <PlusButton onPress={onPlusClick}>
            <Plus>+</Plus>
          </PlusButton>
        </RoutineItem>
        <RoutineText>미설정</RoutineText>
      </ItemWrapper>
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
