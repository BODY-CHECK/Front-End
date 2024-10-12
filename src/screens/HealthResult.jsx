import React, {useState} from 'react';
import {
  Button1,
  Button2,
  ButtonContainer,
  ButtonText1,
  ButtonText2,
  Container,
  ContentContainer,
  ContentText,
  GIFContainer,
  GraphContainer,
  ModalButton1,
  ModalButton2,
  ModalButtonContainer,
  ModalButtonText1,
  ModalButtonText2,
  ModalContainer,
  ModalContent,
  ModalContentText1,
  ModalContentText2,
  StyledGIF,
  TextContainer,
} from './HealtResult.style';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {BarChart} from 'react-native-chart-kit';
import {Alert, Modal} from 'react-native';
import exerciseData from '../components/Health/HealthInfoData';

export default function HealthResult() {
  const route = useRoute();
  const {id} = route.params;
  const exercise = exerciseData.find(ex => ex.id === id);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });

    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  });

  const data = {
    labels: ['이완', '수축', '바디', '체크', '짱', '최고'],
    datasets: [
      {
        data: [50, 45, 28, 80, 99, 43],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(51, 115, 235, ${opacity})`, // 막대의 색상을 파란색으로 설정
    strokeWidth: 2, // 막대 외곽선 두께
    barPercentage: 0.7, // 막대 두께 비율
    useShadowColorFromDataset: false, // 그림자 색상 설정
    fillShadowGradient: '#3373EB', // 막대의 상단 색상
    fillShadowGradientOpacity: 1, // 막대 상단의 투명도
    fillShadowGradientFrom: '#3373EB', // 막대의 시작 색상
    fillShadowGradientFromOpacity: 1, // 막대의 시작 부분 투명도
    fillShadowGradientTo: '#3373EB', // 막대 하단의 색상 (흰색으로 그라데이션)
    fillShadowGradientToOpacity: 1, // 막대 하단 투명도
    propsForBackgroundLines: {
      strokeDasharray: '', // 배경 선을 없앰
    },
  };

  const graphStyle = {
    borderRadius: 16,
    paddingRight: 20,
  };

  // 나가기 버튼을 눌렀을 때 모달 표시
  const handleExit = () => {
    setModalVisible(true);
  };

  // 모달에서 예를 눌렀을 때 처리
  const handleSave = () => {
    setModalVisible(false);
    Alert.alert('피드백이 저장되었습니다!');
    navigation.dispatch(
      CommonActions.reset({
        index: 0, // 첫 번째 스크린을 보여줌
        routes: [{name: '홈'}], // Home 화면을 스택의 유일한 화면으로 설정
      }),
    );
    // 저장 로직을 추가하세요
  };

  // 모달에서 아니오를 눌렀을 때 처리
  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <Container>
      <ContentContainer>
        <GIFContainer>
          <StyledGIF source={exercise.gifSource} />
        </GIFContainer>
        <GraphContainer>
          <BarChart
            style={graphStyle}
            data={data}
            width={350}
            height={220}
            chartConfig={chartConfig}
            fromZero={true}
            verticalLabelRotation={0}
            withInnerLines={false}
            withHorizontalLabels={false}
          />
        </GraphContainer>
        <TextContainer>
          <ContentText>
            이완 수축을 더 해주세요. 수축을 제대로 하지 않으면 운동효과를
            기대하기 어렵습니다.
          </ContentText>
        </TextContainer>
      </ContentContainer>
      <ButtonContainer>
        <Button1
          onPress={() => navigation.navigate('HealthInfo', {id, repCount: 12})}>
          <ButtonText1>다시하기</ButtonText1>
        </Button1>
        <Button2 onPress={handleExit}>
          <ButtonText2>나가기</ButtonText2>
        </Button2>
      </ButtonContainer>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <ModalContainer>
          <ModalContent>
            <ModalContentText1>저장하시겠습니까?</ModalContentText1>
            <ModalContentText2>
              피드백을 저장하면 마이페이지에서 다시 확인할 수 있습니다.
              저장하시겠습니까?
            </ModalContentText2>
            <ModalButtonContainer>
              <ModalButton1 onPress={handleSave}>
                <ModalButtonText1>예</ModalButtonText1>
              </ModalButton1>
              <ModalButton2 onPress={handleCancel}>
                <ModalButtonText2>아니오</ModalButtonText2>
              </ModalButton2>
            </ModalButtonContainer>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
}
