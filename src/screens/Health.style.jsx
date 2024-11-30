import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: flex-end;  // 하단에 고정
  padding-bottom: 20px;
  align-items: center; 
  position: relative;
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

export const CameraIcon = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  color: black;
  position: absolute;
  top: 17px;
  right: 10px;
  background-color: transparent;
`;

export const CameraImage = styled.Image`
  width: 40px;
  height: 40px;
`;

export const NumContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 60px;
  top: 17px;
  background-color: #3373EB;
  border-radius: 90px;
  position: absolute;
`;

export const NumText = styled.Text`
  color: white;
  font-size: 36px;
`;
