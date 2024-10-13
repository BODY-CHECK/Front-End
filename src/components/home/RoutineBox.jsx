import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

const RoutineBox = () => {
  const navigation = useNavigation();
  return (
    <Container>
      <NoRoutineWrapper>
        <TouchableOpacity onPress={() => navigation.navigate('운동 루틴')}>
          <Plus>+</Plus>
        </TouchableOpacity>
        <NoRoutineText>회원님만의 루틴을 만들어보세요.</NoRoutineText>
      </NoRoutineWrapper>
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

const Plus = styled.Text`
  font-size: 90px;
  font-weight: 200;
  color: #6d6d6d;
  margin-top: -25px;
  margin-bottom: -15px;
`;

const NoRoutineText = styled.Text`
  font-size: 10px;
  color: #3c3b40;
`;

const NoRoutineWrapper = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
