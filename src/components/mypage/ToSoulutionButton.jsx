import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';

const ToSolutionButton = () => {
  const navigation = useNavigation();

  return (
    <NavBtn>
      <BtnText>과거의 솔루션들을 확인해보세요!</BtnText>
    </NavBtn>
  );
};

export default ToSolutionButton;

const NavBtn = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: #3373eb;
  align-items: center;
  justify-content: center;
`;

const BtnText = styled.Text`
  color: #fff;
  font-size: 12px;
`;
