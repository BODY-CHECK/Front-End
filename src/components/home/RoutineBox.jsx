import styled from 'styled-components/native';

const RoutineBox = () => {
  return (
    <Container>
      <ItemWrapper>
        <RoutineItem>
          <Plus>+</Plus>
        </RoutineItem>
        <RoutineText>미설정</RoutineText>
      </ItemWrapper>
      <ItemWrapper>
        <RoutineItem>
          <Plus>+</Plus>
        </RoutineItem>
        <RoutineText>미설정</RoutineText>
      </ItemWrapper>
      <ItemWrapper>
        <RoutineItem>
          <Plus>+</Plus>
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
  background-color: #ececec;
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
  background-color: #fff;
  margin-bottom: 5px;
  align-items: center;
`;

const RoutineText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: black;
`;

const Plus = styled.Text`
  font-size: 64px;
  color: #e5e5e5;
`;
