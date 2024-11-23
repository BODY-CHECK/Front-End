import React from 'react';
import {Modal, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import styled from 'styled-components/native';

const ConfirmModal = ({visible, message, onConfirm}) => {
  if (!visible) return null;

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <ModalContainer>
        <ModalView>
          <ModalText>{message}</ModalText>
          <ButtonContainer>
            <ConfirmButton onPress={onConfirm}>
              <ButtonText>확인</ButtonText>
            </ConfirmButton>
          </ButtonContainer>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};

export default ConfirmModal;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* 배경 투명도 조절 */
`;

const ModalView = styled.View`
  width: 75%;
  height: 160px;
  background-color: white;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;

const ModalText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: black;
`;

const SubText = styled.Text`
  font-size: 10px;
  color: #7c86a2;
  margin-bottom: 35px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

const ConfirmButton = styled.TouchableOpacity`
  background-color: #3373eb;
  width: 40%;
  height: 30px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  padding: 5px 0;
`;

const ButtonText = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: white;
`;
