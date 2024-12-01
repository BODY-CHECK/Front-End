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
import {Modal, StyleSheet} from 'react-native';
import exerciseData from '../components/Health/HealthInfoData';
import {
  postAttendance,
  postExerciseCriteria,
  postExerciseSolution,
} from '../api/SolutionApi'; // API 호출 함수 import
import Video from 'react-native-video';
import Loading from './Loading';
import {stopRecording} from './Record';
import ConfirmModal from '../components/ConfirmModal';
import idToLabels from '../components/Health/Labels';

export default function HealthResult() {
  const route = useRoute();
  const {id, resultArray, premium} = route.params;
  const exercise = exerciseData.find(ex => ex.id === id);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 모달 동작 관리
  const [confirmModalVisible, setConfirmModalVisible] = useState(false); // ConfirmModal 상태
  const [confirmModalMessage, setConfirmModalMessage] = useState(''); // ConfirmModal 메시지
  const navigation = useNavigation();
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(true); // 녹화 상태 관리
  const [isURL, setIsURL] = useState(null);
  const [saveloading, setSaveLoading] = useState(false);

  const exerciseId = id; // 현재 운동 ID
  const labels = getLabelsForId(exerciseId);

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

  // ID에 따른 라벨 가져오기 함수
  function getLabelsForId(exerciseId) {
    return idToLabels[exerciseId] || ['라벨 없음', '라벨 없음', '라벨 없음'];
  }

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

  useEffect(() => {
    if (isRecording && premium) {
      stopRecording(setIsURL, setIsRecording);
      console.log(isURL);
    }
  }, []);

  const data = {
    labels: labels,
    datasets: [
      {
        data: resultArray || [0, 0, 0],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(51, 115, 235, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    fillShadowGradient: '#3373EB',
    fillShadowGradientOpacity: 1,
    fillShadowGradientFrom: '#3373EB',
    fillShadowGradientFromOpacity: 1,
    fillShadowGradientTo: '#3373EB',
    fillShadowGradientToOpacity: 1,
    propsForHorizontalLabels: {
      dx: -18,
      dy: 0,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
    },
  };

  const graphStyle = {
    borderRadius: 16,
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

      const result = await postExerciseSolution(
        exerciseId,
        solutionVideo,
        criteria,
        content,
      );

      setConfirmModalVisible(true);
      setConfirmModalMessage('피드백이 저장되었습니다.');
    } catch (error) {
    } finally {
      setSaveLoading(false);
    }
  };

  const handleModalYes = () => {
    setModalVisible(false);

    if (modalAction === 'exit') {
      handleSave();
    } else if (modalAction === 'retry') {
      handleSave();
    }
  };

  const handleModalNo = () => {
    setModalVisible(false);

    if (modalAction === 'exit') {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: '홈'}],
        }),
      );
    }
    else{
      navigation.navigate('HealthInfo', {id, repCount: 12});
    }
  };

  const handleConfirmClick = () => {
    setConfirmModalVisible(false);

    if (modalAction === 'retry') {
      navigation.navigate('HealthInfo', {id, repCount: 12});
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: '홈'}],
        }),
      );
    }
  };

  if (saveloading) {
    return <Loading text="솔루션 저장 중입니다..." />;
  }
  if (loading) {
    return <Loading text="솔루션 생성 중입니다..." />;
  }

  return (
    <Container>
      <ContentContainer>
        <GIFContainer>
          {premium ? (
            isURL ? (
              <Video
                source={{uri: isURL}}
                style={styles.video}
                controls={true}
                resizeMode="contain"
                paused={true}
                repeat={false}
              />
            ) : (
              <ContentText>녹화 권한을 추가해주세요!</ContentText>
            )
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
          onPress={() => {
            setModalAction('retry');
            setModalVisible(true);
          }}>
          <ButtonText1>다시하기</ButtonText1>
        </Button1>
        <Button2
          onPress={() => {
            setModalAction('exit');
            setModalVisible(true);
          }}>
          <ButtonText2>나가기</ButtonText2>
        </Button2>
      </ButtonContainer>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <ModalContainer>
          <ModalContent>
            <ModalExitButton onPress={() => setModalVisible(false)}>
              <ModalExitButtonText>X</ModalExitButtonText>
            </ModalExitButton>
            <ModalContentText1>저장하시겠습니까?</ModalContentText1>
            <ModalContentText2>
              피드백을 저장하면 마이페이지에서 다시 확인할 수 있습니다.
              저장하시겠습니까?
            </ModalContentText2>
            <ModalButtonContainer>
              <ModalButton1 onPress={handleModalYes}>
                <ModalButtonText1>예</ModalButtonText1>
              </ModalButton1>
              <ModalButton2 onPress={handleModalNo}>
                <ModalButtonText2>아니오</ModalButtonText2>
              </ModalButton2>
            </ModalButtonContainer>
          </ModalContent>
        </ModalContainer>
      </Modal>
      <ConfirmModal
        visible={confirmModalVisible}
        message={confirmModalMessage}
        onConfirm={handleConfirmClick}
      />
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
