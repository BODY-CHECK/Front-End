import React, {useEffect, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Button,
  ButtonText,
  Container,
  ContentContainer,
  ContentText,
  DifficultyText,
  GIFContainer,
  InfoContainer,
  ItemContainer,
  ItemText,
  MainMuscleText,
  ModalButton,
  ModalButtonContainer,
  ModalButtonText,
  ModalContainer,
  ModalContent,
  ModalContentText,
  ModalExitButton,
  ModalExitButtonText,
  NumContainer,
  SecondaryMuscleText,
  StyledGIF,
  TargetMuscleText,
  TextContainer,
  TitleText,
} from './HealthInfo.style';
import {Modal} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import exerciseData from '../components/Health/HealthInfoData';
import RecordScreen from 'react-native-record-screen';
import {getPremium} from '../api/SolutionApi';

export default function HealthInfo() {
  const route = useRoute();
  const navigation = useNavigation();
  const {id} = route.params;
  const exercise = exerciseData.find(ex => ex.id === id);
  const [modalVisible, setModalVisible] = useState(false);
  const [repCount, setRepCount] = useState(12); // 운동 개수 저장
  const [contentWidth, setContentWidth] = useState(0);
  const itemWidth = 50;
  const numbers = [...Array(20).keys()].map(i => (i + 1).toString());
  const scrollViewRef = useRef(null);
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    if (scrollViewRef.current) {
      const initialScrollPosition = (repCount - 1) * itemWidth;
      scrollViewRef.current.scrollTo({
        x: initialScrollPosition,
        animated: false,
      });
    }
  }, [contentWidth]);

  useEffect(() => {
    const getPremiumResponse = async () => {
      try {
        const response = await getPremium();
        setPremium(response.result.premium);
        console.log('프리미엄?', premium);
      } catch (err) {
        console.error('Error during API posting:', err.request);
      }
    };

    getPremiumResponse();
  }, [id]);

  const handleScroll = event => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / itemWidth);
    setRepCount(index + 1); // Index starts from 0, so adding 1
  };

  // 녹화 시작 함수
  const startRecording = async () => {
    try {
      const response = await RecordScreen.startRecording({
        fps: 30,
        bitrate: 1000000,
        mic: true,
      });

      if (response === 'started') {
        console.log('녹화가 시작되었습니다.');
      } else if (response === 'permission_error') {
        console.warn('녹화 권한이 거부되었습니다.');
      }
    } catch (error) {
      console.error('녹화 시작 오류:', error);
    }
  };

  const handleExcercise = () => {
    setModalVisible(true);
  };

  const handleSelect = () => {
    setModalVisible(false);

    if (premium) {
      startRecording().then(() => {
        navigation.navigate('Health', {id, repCount, premium});
      });
    } else {
      navigation.navigate('Health', {id, repCount, premium});
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <Container>
      <ContentContainer>
        <GIFContainer>
          <StyledGIF source={exercise.gifSource} />
        </GIFContainer>
        <InfoContainer>
          <DifficultyText difficulty={exercise.difficulty}>
            {' '}
            {exercise.difficulty}{' '}
          </DifficultyText>
          <TargetMuscleText> {exercise.targetMuscle} </TargetMuscleText>
          <MainMuscleText> {exercise.mainMuscle} </MainMuscleText>
          <SecondaryMuscleText>
            {' '}
            {exercise.secondaryMuscle}{' '}
          </SecondaryMuscleText>
        </InfoContainer>
        <TextContainer>
          <TitleText>운동 순서</TitleText>
          {exercise.exerciseOrder.map((step, index) => (
            <ContentText key={index}>{step}</ContentText>
          ))}
        </TextContainer>
        <TextContainer>
          <TitleText>주의 사항</TitleText>
          {exercise.caution.map((cautionItem, index) => (
            <ContentText key={index}>{cautionItem}</ContentText>
          ))}
        </TextContainer>
      </ContentContainer>
      <Button onPress={handleExcercise}>
        <ButtonText>AI와 함께 운동해보세요!</ButtonText>
      </Button>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <ModalContainer
          onLayout={e => setContentWidth(e.nativeEvent.layout.width)}>
          <ModalContent>
            <ModalContentText>{exercise.title}</ModalContentText>
            <ModalExitButton onPress={handleCancel}>
              <ModalExitButtonText>X</ModalExitButtonText>
            </ModalExitButton>
            <NumContainer>
              <ScrollView
                horizontal
                ref={scrollViewRef}
                snapToInterval={itemWidth} // Snaps to the next item
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: (contentWidth - itemWidth - 103) / 2,
                }}
                onScroll={handleScroll}
                scrollEventThrottle={16}>
                {numbers.map((item, index) => (
                  <ItemContainer
                    key={index}
                    width={itemWidth}
                    selected={repCount === parseInt(item, 10)}>
                    <ItemText selected={repCount === parseInt(item, 10)}>
                      {item}
                    </ItemText>
                  </ItemContainer>
                ))}
              </ScrollView>
            </NumContainer>
            <ModalButtonContainer>
              <ModalButton onPress={handleSelect}>
                <ModalButtonText>선택</ModalButtonText>
              </ModalButton>
            </ModalButtonContainer>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
}
