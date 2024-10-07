import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: white;
`;

export const HeaderContainer = styled.View`
  background-color: white;
`;

export const HealthType = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: black;
  margin-left: 5px;
`;

export const ContentContainer = styled.ScrollView`
  flex: 1;
`;

export const GIFContainer = styled.View`
  margin-top: 10px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid black;
`;

export const StyledGIF = styled.Image`
  width: 50%;
  height: 100%;
  border-width: 1px;
  border-radius: 10px;
`;

export const TextContainer = styled.View`
  padding: 10px;
  background-color: white;
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  max-width: 400px;
  height: 50px;
  padding: 15px;
  margin-top: 10px;
  background-color: #3373eb;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const NumContainer = styled.View`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NumText = styled.Text`
  color: #000;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 25px;
`;

export const SelectNumText = styled.Text`
  color: #333;
  font-size: 18px;
  margin-top: 20px;
`;

export const ItemContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: ${props => props.width}px;
  background-color: ${props => (props.selected ? '#D9D9D9' : 'white')};
  border-radius: 90px;
`;

export const ItemText = styled.Text`
  font-size: ${props => (props.selected ? '36px' : '18px')};
  color: ${props => (props.selected ? 'black' : 'gray')};
  
`;
