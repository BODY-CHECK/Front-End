import React, {useState, useEffect} from 'react';
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
import { postExerciseCriteria, postExerciseSolution } from '../api/SolutionApi'; // API 호출 함수 import

export default function HealthResult() {
  const route = useRoute();
  const {id, resultArray} = route.params;
  const exercise = exerciseData.find(ex => ex.id === id);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const CriteriaData = [
    {
      criteriaIdx: 1,
      criteriaName: '팔의 구부림 각도가 정확한가',
      score: resultArray[0],
    },
    {
      criteriaIdx: 2,
      criteriaName: '자세가 일직선으로 정렬되어 있는가',
      score: resultArray[1],
    },
    {
      criteriaIdx: 3,
      criteriaName: '무릎의 구부림 각도가 정확한가',
      score: resultArray[2],
    },
  ];
  console.log(CriteriaData);

  useFocusEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });

    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  });

  useEffect(() => {
    const fetchApiResponse = async () => {
      try {
        const response = await postExerciseCriteria(id, CriteriaData);
        setApiResponse(response);
      } catch (err) {
        console.error('Error during API call:', err.request);
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchApiResponse();
  }, [id]);


  const data = {
    labels: ['팔 각도', '자세 장렬', '무릎 각도'],
    datasets: [
      {
        data: resultArray || [0, 0, 0],
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
    propsForHorizontalLabels: {
      dx: -18, // x축 위치 조정
      dy: 0},
    propsForBackgroundLines: {
      strokeDasharray: '', // 배경 선을 없앰
    },
  };

  const graphStyle = {
    borderRadius: 16,
  };

  // 나가기 버튼을 눌렀을 때 모달 표시
  const handleExit = () => {
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const exerciseId = id;
      const criteria = {
        criteria: CriteriaData,
      };
      const content = apiResponse;
      const video = null;

      // postExerciseSolution 함수 호출
      const result = await postExerciseSolution(exerciseId, video, criteria, content);
      console.log('API Response:', result);

      Alert.alert('피드백이 저장되었습니다!');
      setModalVisible(false);

      navigation.dispatch(
        CommonActions.reset({
          index: 0, // 첫 번째 스크린을 보여줌
          routes: [{ name: '홈' }], // Home 화면으로 이동
        })
      );
    } catch (error) {
      Alert.alert('데이터 전송에 실패했습니다.');
    }
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
            withInnerLines={true}
            withHorizontalLabels={true}
          />
        </GraphContainer>
        <TextContainer>
          <ContentText>
            {apiResponse || '로딩 중...'}
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
