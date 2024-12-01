import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Modal, Text} from 'react-native';

const ExerciseCard = ({onSetRoutine, onCardPress}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(''); // 선택된 카드에 따라 텍스트를 다르게 보여줌

  const handleCardPress = cardType => {
    if (onCardPress) onCardPress(); // 설정 모드 종료 함수 호출
    setSelectedCard(cardType);
    setModalVisible(true);
  };

  const confirmRoutineChange = () => {
    onSetRoutine(selectedCard); // 루틴 타입 전달
    setModalVisible(false);
  };

  return (
    <CardContainer>
      <Card onPress={() => handleCardPress('헬린이')}>
        <CardImage source={require('../../assets/images/healthbaby.png')} />
      </Card>
      <Card
        onPress={() => {
          handleCardPress('헬고수');
        }}>
        <CardImage source={require('../../assets/images/healthgosu.png')} />
      </Card>

      {/* 모달 컴포넌트 */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <ModalContainer>
          <ModalView>
            <ModalText>
              <Text style={{color: '#3373eb', fontWeight: 'bold'}}>
                {selectedCard} 추천 루틴
              </Text>
              으로 변경하시겠습니까?
            </ModalText>
            <SubText>기존에 설정한 루틴은 사라집니다.</SubText>
            <ButtonContainer>
              <ConfirmButton onPress={confirmRoutineChange}>
                <ButtonText style={{color: '#fff'}}>확인</ButtonText>
              </ConfirmButton>
              <CancelButton onPress={() => setModalVisible(false)}>
                <ButtonText>취소</ButtonText>
              </CancelButton>
            </ButtonContainer>
          </ModalView>
        </ModalContainer>
      </Modal>
    </CardContainer>
  );
};

export default ExerciseCard;

const CardContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const Card = styled.TouchableOpacity`
  width: 170px;
  height: 170px;
  border-radius: 10px;
  background-color: #fff;
  align-items: center;
`;

const CardImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* 배경 투명도 조절 */
`;

const ModalView = styled.View`
  width: 80%;
  height: 185px;
  padding: 20px;
  background-color: white;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;

const ModalText = styled.Text`
  font-size: 16px;
  text-align: center;
  margin-bottom: 10px;
  color: black;
`;

const SubText = styled.Text`
  font-size: 12px;
  color: #7c86a2;
  margin-bottom: 35px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

const ConfirmButton = styled.TouchableOpacity`
  background-color: #3373eb;
  width: 45%;
  height: 40px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin: 0 7px 0 5px;
`;

const CancelButton = styled.TouchableOpacity`
  background-color: #3c3b40;
  width: 45%;
  height: 40px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin: 0 5px 0 7px;
`;

const ButtonText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: white;
`;
