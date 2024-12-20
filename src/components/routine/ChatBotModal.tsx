import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import styled from 'styled-components/native';
import instance from '../../axiosInstance';
import {launchImageLibrary} from 'react-native-image-picker';

const {width, height} = Dimensions.get('window');

interface Message {
  id: number;
  content: string;
  sender: 'bot' | 'user';
  showSaveButton?: boolean;
}

interface ChatBotModalProps {
  visible: boolean;
  onClose: () => void;
  onSaveRoutine?: (routine: string) => void;
  exerciseData: any[];
}

const INITIAL_MESSAGE = {
  id: 1,
  content:
    '안녕하세요!\nBodyCheck 챗봇 몸짱이에요!\n추천받고 싶은 루틴을 골라보세요.',
  sender: 'bot' as const,
};

// 요일별 루틴이 포함되어 있는지 확인하는 함수
const containsWeeklyRoutine = (content: string): boolean => {
  const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
  let foundDays = 0;

  weekdays.forEach(day => {
    if (content.includes(day)) {
      foundDays++;
    }
  });

  // 모든 요일이 포함되어 있는 경우에만 true 반환
  return foundDays === 7;
};

const ChatBotModal = ({visible, onClose, onSaveRoutine}: ChatBotModalProps) => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false); // 확인 모달 표시 상태
  const [selectedRoutine, setSelectedRoutine] = useState<string | null>(null); // 선택된 루틴 저장
  const [nickname, setNickname] = useState<string>(''); // 닉네임 상태
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지

  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8, // 이미지 품질 (0.0 ~ 1.0)
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('이미지 선택 취소');
      } else if (response.errorCode) {
        console.error('이미지 선택 오류:', response.errorMessage);
      } else {
        const image = response.assets[0];
        setSelectedImage({
          uri: image.uri,
          name: image.fileName,
          type: image.type,
        });
      }
    });
  };

  useEffect(() => {
    if (!visible) {
      setMessages([INITIAL_MESSAGE]);
      setInputValue('');
      setShowMenu(false);
    } else {
      fetchUserNickname();
    }
  }, [visible]);

  const fetchUserNickname = async () => {
    try {
      const response = await instance.get('/members/my-page');
      if (response.data.isSuccess) {
        const {nickname} = response.data.result;
        setNickname(nickname); // 닉네임 상태 업데이트

        // 초기 메시지 설정
        setMessages([
          {
            id: 1,
            content: `${nickname}님 안녕하세요!\nBodyCheck 챗봇 몸짱이에요!\n추천받고 싶은 루틴을 골라보세요.`,
            sender: 'bot',
          },
        ]);
      } else {
        console.error('닉네임 불러오기 실패:', response.data.message);
      }
    } catch (error) {
      console.error('닉네임 API 호출 오류:', error);
    }
  };

  const getBotResponse = async (prompt: string, image: any = null) => {
    try {
      setIsLoading(true);
      // FormData 생성
      const formData = new FormData();
      if (image) {
        formData.append('image', {
          uri: image.uri,
          name: image.name,
          type: image.type,
        });
      }
      if (prompt) {
        formData.append('prompt', prompt);
      }

      // API 호출
      const response = await instance.post(
        '/api/routine/recommendation',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.isSuccess) {
        return response.data.result;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error getting bot response:', error);
      return '죄송합니다. 응답을 받아오는 중 오류가 발생했습니다.';
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (content: string = inputValue) => {
    if (!content.trim()) return;

    // 사용자 메시지 추가
    const newUserMessage = {
      id: messages.length + 1,
      content: content || '', // 텍스트가 없으면 빈 문자열
      sender: 'user' as const,
      image: selectedImage || null, // 선택된 이미지 추가
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setShowMenu(false);
    setSelectedImage(null); // 선택된 이미지 초기화

    // Get bot response from API
    const botResponse = await getBotResponse(content);

    const newBotMessage = {
      id: messages.length + 2,
      content: botResponse,
      sender: 'bot' as const,
      // 요일별 루틴이 포함된 경우에만 저장 버튼 표시
      showSaveButton: containsWeeklyRoutine(botResponse),
    };

    setMessages(prev => [...prev, newBotMessage]);
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

  const handleSaveRoutine = (content: string) => {
    setSelectedRoutine(content); // 선택된 루틴 저장
    setConfirmModalVisible(true); // 확인 모달 표시
  };

  const handleConfirm = () => {
    if (onSaveRoutine && selectedRoutine) {
      onSaveRoutine(selectedRoutine); // 루틴 저장
    }
    setConfirmModalVisible(false); // 모달 닫기
  };

  const handleCancel = () => {
    setSelectedRoutine(null); // 선택된 루틴 초기화
    setConfirmModalVisible(false); // 모달 닫기
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior="height"
        style={{flex: 1}}
        keyboardVerticalOffset={20}>
        <Modal visible={visible} transparent>
          <TouchableWithoutFeedback onPress={onClose}>
            <ModalOverlay />
          </TouchableWithoutFeedback>
          <ModalWrapper>
            <ModalContainer>
              <SafeAreaView style={{flex: 1}}>
                <Container>
                  <Header>
                    <HeaderTitle>BodyCheck 챗봇 몸짱</HeaderTitle>
                    <CloseButton onPress={onClose}>
                      <CloseButtonText>✕</CloseButtonText>
                    </CloseButton>
                  </Header>

                  <MessageContainer ref={scrollViewRef}>
                    {messages.map(message => (
                      <MessageWrapper key={message.id} sender={message.sender}>
                        <MessageBubble sender={message.sender}>
                          {/* 이미지 표시 */}
                          {message.image && (
                            <MessageImage source={{uri: message.image.uri}} />
                          )}
                          {/* 텍스트 표시 */}
                          {message.content && (
                            <MessageText sender={message.sender}>
                              {message.content}
                            </MessageText>
                          )}

                          {message.showSaveButton && (
                            <SaveButton
                              onPress={() =>
                                handleSaveRoutine(message.content)
                              }>
                              <SaveButtonText>루틴 저장하기</SaveButtonText>
                            </SaveButton>
                          )}
                        </MessageBubble>
                      </MessageWrapper>
                    ))}
                    {isLoading && (
                      <LoadingContainer>
                        <ActivityIndicator color="#6C7BF2" />
                      </LoadingContainer>
                    )}
                  </MessageContainer>

                  <BottomContainer>
                    {showMenu && (
                      <ChipsContainer>
                        <ChipButton
                          onPress={() =>
                            handleSend('상체 위주 운동을 추천해주세요.')
                          }>
                          <ChipText>상체 위주</ChipText>
                        </ChipButton>
                        <ChipButton
                          onPress={() =>
                            handleSend('하체 위주 운동을 추천해주세요.')
                          }>
                          <ChipText>하체 위주</ChipText>
                        </ChipButton>
                        <ChipButton onPress={handleSelectImage}>
                          <ChipText>사진 첨부</ChipText>
                        </ChipButton>
                      </ChipsContainer>
                    )}

                    <InputContainer>
                      {/* 이미지 미리보기 UI */}
                      {selectedImage && (
                        <ImagePreviewContainer>
                          <PreviewImage source={{uri: selectedImage.uri}} />
                          <DeleteButton onPress={() => setSelectedImage(null)}>
                            <DeleteButtonText>✕</DeleteButtonText>
                          </DeleteButton>
                        </ImagePreviewContainer>
                      )}
                      <InputItemsContainer>
                        <MenuButton onPress={() => setShowMenu(!showMenu)}>
                          <MenuButtonText>#</MenuButtonText>
                        </MenuButton>
                        <StyledInput
                          value={inputValue}
                          onChangeText={setInputValue}
                          onSubmitEditing={() => handleSend()}
                          placeholder="몸짱이에게 루틴을 추천 받아 보세요."
                          placeholderTextColor="#666"
                          editable={!isLoading}
                        />
                        <SendButton
                          onPress={() => handleSend()}
                          disabled={isLoading}>
                          <SendButtonText>›</SendButtonText>
                        </SendButton>
                      </InputItemsContainer>
                    </InputContainer>
                  </BottomContainer>
                </Container>
              </SafeAreaView>
            </ModalContainer>
          </ModalWrapper>
        </Modal>
      </KeyboardAvoidingView>

      {/* 확인 모달 */}
      <Modal
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => {
          setConfirmModalVisible(false);
        }}>
        <ConfirmModalContainer>
          <ConfirmModalView>
            <ConfirmModalText>
              <Text style={{color: '#3373eb', fontWeight: 'bold'}}>
                AI가 제공한 루틴
              </Text>
              으로 변경하시겠습니까?
            </ConfirmModalText>
            <ConfirmSubText>변경 시 기존 루틴은 덮어씌워집니다.</ConfirmSubText>
            <ConfirmButtonContainer>
              <ConfirmConfirmButton onPress={handleConfirm}>
                <ConfirmButtonText>확인</ConfirmButtonText>
              </ConfirmConfirmButton>
              <ConfirmCancelButton onPress={handleCancel}>
                <ConfirmButtonText>취소</ConfirmButtonText>
              </ConfirmCancelButton>
            </ConfirmButtonContainer>
          </ConfirmModalView>
        </ConfirmModalContainer>
      </Modal>
    </>
  );
};

export default ChatBotModal;

// Styled Components
const ModalWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ModalOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled.View`
  width: ${width * 0.9}px;
  height: ${height * 0.6}px;
  background-color: #eef1ff;
  border-radius: 20px;
  overflow: hidden;
`;

const Container = styled.View`
  flex: 1;
  background-color: #eef1ff;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: #eef1ff;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  right: 16px;
`;

const CloseButtonText = styled.Text`
  font-size: 20px;
  color: #666;
`;

const MessageContainer = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const MessageWrapper = styled.View<{sender: string}>`
  flex-direction: row;
  justify-content: ${props =>
    props.sender === 'user' ? 'flex-end' : 'flex-start'};
  margin-bottom: 16px;
`;

const MessageBubble = styled.View<{sender: string}>`
  max-width: 80%;
  border-radius: 20px;
  padding: 12px 16px;
  background-color: ${props =>
    props.sender === 'user' ? '#6C7BF2' : '#FFFFFF'};
`;

const MessageText = styled.Text<{sender: string}>`
  font-size: 14px;
  line-height: 20px;
  color: ${props => (props.sender === 'user' ? '#FFFFFF' : '#000000')};
`;

const MessageImage = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const BottomContainer = styled.View`
  padding: 16px;
  background-color: #ffffff;
`;

const ChipsContainer = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-bottom: 16px;
`;

const ChipButton = styled.TouchableOpacity`
  padding: 8px 16px;
  border-radius: 20px;
  border-width: 1px;
  border-color: #e5e5e5;
`;

const ChipText = styled.Text`
  font-size: 14px;
  color: #000000;
`;

const InputContainer = styled.View`
  flex-direction: column;
  background-color: #eef1ff;
  border-radius: 25px;
  padding: 4px;
`;

const MenuButton = styled.TouchableOpacity`
  padding: 8px;
`;

const MenuButtonText = styled.Text`
  font-size: 20px;
  color: #6c7bf2;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  font-size: 14px;
  padding: 8px;
`;

const SendButton = styled.TouchableOpacity`
  padding: 8px;
`;

const SendButtonText = styled.Text`
  font-size: 24px;
  color: #6c7bf2;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: #6c7bf2;
  padding: 12px 20px;
  border-radius: 5px;
  width: 90%;
  margin-top: 12px;
  align-self: center;
`;

const SaveButtonText = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

const LoadingContainer = styled.View`
  padding: 16px;
  align-items: center;
`;

const ConfirmModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* 배경 투명도 조절 */
`;

const ConfirmModalView = styled.View`
  width: 80%;
  height: 185px;
  padding: 20px;
  background-color: white;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;

const ConfirmModalText = styled.Text`
  font-size: 16px;
  text-align: center;
  margin-bottom: 10px;
  color: black;
`;

const ConfirmSubText = styled.Text`
  font-size: 12px;
  color: #7c86a2;
  margin-bottom: 35px;
`;

const ConfirmButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

const ConfirmConfirmButton = styled.TouchableOpacity`
  background-color: #3373eb;
  width: 45%;
  height: 40px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin: 0 7px 0 5px;
`;

const ConfirmCancelButton = styled.TouchableOpacity`
  background-color: #3c3b40;
  width: 45%;
  height: 40px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin: 0 5px 0 7px;
`;

const ConfirmButtonText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: white;
`;

const InputItemsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ImagePreviewContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 2px 5px;
`;

const PreviewImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 5px;
`;

const DeleteButton = styled.TouchableOpacity`
  top: -20px; /* 사진 위쪽 여백 */
  right: 10px; /* 사진 오른쪽 여백 */
  width: 15px;
  height: 15px;
  background-color: red;
  border-radius: 10px; /* 동그라미 버튼 */
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const DeleteButtonText = styled.Text`
  color: white;
  font-size: 10px;
  font-weight: bold;
`;
