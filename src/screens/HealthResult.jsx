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
  ModalExitButton,
  ModalExitButtonText,
  TextContainer,
} from './HealtResult.style';
import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';
import {BarChart} from 'react-native-chart-kit';
import {Alert, Modal, StyleSheet} from 'react-native';
import exerciseData from '../components/Health/HealthInfoData';
import {
  getPremium,
  postAttendance,
  postExerciseCriteria,
  postExerciseSolution,
} from '../api/SolutionApi'; // API 호출 함수 import
import Video from 'react-native-video';
import Loading from './Loading';
import {stopRecording} from './Record';

export default function HealthResult() {
  const route = useRoute();
  const {id, resultArray, premium} = route.params;
  const exercise = exerciseData.find(ex => ex.id === id);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(true); // 녹화 상태 관리
  const [isURL, setIsURL] = useState(null);
  const [saveloading, setSaveLoading] = useState(false);
  const CriteriaData = [
    {
      score: resultArray[0],
    },
    {
      score: resultArray[1],
    },
    {
      score: resultArray[2],
    },
  ];

  useEffect(() => {
    const AttendanceResponse = async () => {
      try {
        await postAttendance(id, CriteriaData);
        console.log('출석 완료!');
      } catch (err) {
        console.error('Error during API post:', err.request);
      }
    };

    AttendanceResponse();
  }, [id]);

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

  // 컴포넌트가 렌더링될 때 녹화 종료 함수 실행
  useEffect(() => {
    if (isRecording && premium) {
      stopRecording(setIsURL, setIsRecording);
      console.log(isURL);
    }
  }, []);

  const data = {
    labels: ['팔 각도', '자세 정렬', '무릎 각도'],
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
      dy: 0,
    },
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
      setSaveLoading(true);
      const exerciseId = id;
      const criteria = {
        criteria: CriteriaData,
      };
      const content = apiResponse;
      const solutionVideo = isURL;

      // postExerciseSolution 함수 호출
      const result = await postExerciseSolution(
        exerciseId,
        solutionVideo,
        criteria,
        content,
      );


      setModalVisible(false);

      navigation.dispatch(
        CommonActions.reset({
          index: 0, // 첫 번째 스크린을 보여줌
          routes: [{name: '홈'}], // Home 화면으로 이동
        }),
      );
    } catch (error) {

    } finally {
      setSaveLoading(false); // 로딩 종료
    }
  };

  // 모달에서 아니오를 눌렀을 때 처리
  const handleCancel = () => {
    setModalVisible(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: '홈'}],
      }),
    );
  };

  // 모달에서 x를 눌렀을 때 처리
  const handleX = () => {
    setModalVisible(false);
  };

  if (saveloading) {
    return <Loading text="데이터 저장 중입니다..." />; // 로딩 화면 표시
  }

  return (
    <Container>
      <ContentContainer>
        <GIFContainer>
          {premium ? (
            <Video
              source={{uri: isURL}} // 비디오 파일의 URL 또는 로컬 파일 경로
              style={styles.video}
              controls={true} // 기본 컨트롤러 표시 (재생, 일시정지, 탐색바 등)
              resizeMode="contain" // 비디오 크기 조절 방식 ('cover', 'contain', 'stretch' 등)
              paused={false} // true일 경우 비디오가 일시정지됨
              repeat={false} // 비디오 반복 재생
            />
          ) : (
            <ContentText>프리미엄 회원이 되어보세요!</ContentText>
          )}
        </GIFContainer>
        <GraphContainer>
          <BarChart
            style={graphStyle}
            data={data}
            width={350}
            height={220}
            chartConfig={chartConfig}
            fromZero={true}
            fromNumber={100}
            verticalLabelRotation={0}
            withInnerLines={true}
            withHorizontalLabels={true}
          />
        </GraphContainer>
        <TextContainer>
          <ContentText>{apiResponse || '로딩 중...'}</ContentText>
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
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <ModalContainer>
          <ModalContent>
            <ModalExitButton onPress={handleX}>
              <ModalExitButtonText>X</ModalExitButtonText>
            </ModalExitButton>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: 'black',
  },
});
