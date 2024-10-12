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

export const GraphContainer = styled.View`
  padding: 10px;
  background-color: white;
`;

export const TextContainer = styled.View`
  padding: 10px;
  min-height: 130px;
  border-radius: 10px;
  border: 1px solid black;
`;

export const ContentText = styled.Text`
  color: #000;
  font-weight: bold;
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  aligin-items: center;
  background-color: transparent;
  margin-top: 10px;
`;

export const Button1 = styled.TouchableOpacity`
  width: 45%;
  height: 50px;
  padding: 15px;
  background-color: #3373eb;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
`;

export const Button2 = styled.TouchableOpacity`
  width: 45%;
  height: 50px;
  padding: 15px;
  background-color: #3C3B40;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
`;

export const ButtonText1 = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const ButtonText2 = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* 투명한 배경 */
`;

export const ModalContent = styled.View`
  width: 350px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  align-items: center;
`;

export const ModalContentText1 = styled.Text`
  color: black;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
`;

export const ModalContentText2 = styled.Text`
  color: #7C86A2;
  margin-bottom: 15px;
  text-align: center;
  font-size: 15px;
`;

export const ModalButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  aligin-items: center;
  background-color: transparent;
  margin-top: 10px;
`;

export const ModalButton1 = styled.TouchableOpacity`
  width: 45%;
  height: 50px;
  padding: 15px;
  background-color: #3373eb;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
`;

export const ModalButton2 = styled.TouchableOpacity`
  width: 45%;
  height: 50px;
  padding: 15px;
  background-color: #3C3B40;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
`;

export const ModalButtonText1 = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const ModalButtonText2 = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
