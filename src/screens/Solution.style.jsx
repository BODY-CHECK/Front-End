import styled from 'styled-components/native';

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* 배경 투명도 조절 */
`;

export const ModalView = styled.View`
  width: 80%;
  height: 185px;
  background-color: white;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;

export const ModalText = styled.Text`
  font-size: 16px;
  text-align: center;
  margin-bottom: 10px;
  color: black;
`;

export const SubText = styled.Text`
  font-size: 10px;
  color: #7c86a2;
  margin-bottom: 35px;
`;

export const ModalButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

export const ConfirmButton = styled.TouchableOpacity`
  background-color: #3373eb;
  width: 40%;
  height: 30px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  padding: 5px 0;
`;

export const CancelButton = styled.TouchableOpacity`
  background-color: #3c3b40;
  width: 40%;
  height: 30px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

export const ButtonText = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: white;
`;

export const RealButton = styled.TouchableOpacity`
  width: 100%;
  max-width: 400px;
  height: 50px;
  padding: 15px;
  margin-top: 10px;
  background-color: #3373eb;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

export const RealButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;