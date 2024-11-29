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
  TextContainer,
} from './HealtResult.style';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {BarChart} from 'react-native-chart-kit';
import {getSolutionById} from '../api/SolutionApi'; // API 호출 함수 import
import {Modal, StyleSheet, Text} from 'react-native';
import Video from 'react-native-video';
import { ButtonText, CancelButton, ConfirmButton, ModalContainer, ModalText, ModalView, SubText, ModalButtonContainer, RealButton, RealButtonText } from './Solution.style';
import Loading from './Loading';

export default function Solution() {
  const route = useRoute();
  const {id, exerciseId, premium} = route.params;
  const [solutionData, setSolutionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const response = await getSolutionById(id);
        console.log(response.result);
        setSolutionData(response.result);
      } catch (err) {
        console.error('Error during API calling:', err);
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSolution();
  }, [id]);

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


  if (loading) {
    return <Loading text="데이터를 불러오고 있어요..." />; // 로딩 화면 표시
  }

  if (error) {
    return <ContentText>{error}</ContentText>;
  }

  return (
    <Container>
      <ContentContainer>
        <GIFContainer>
          {/* solutionVideoUrl을 렌더링 */}
          {solutionData?.solutionVideoUrl ? (
            <Video
              source={{uri: `${solutionData.solutionVideoUrl}.mp4`}} // 비디오 파일의 URL 또는 로컬 파일 경로
              style={styles.video}
              controls={true} // 기본 컨트롤러 표시 (재생, 일시정지, 탐색바 등)
              resizeMode="contain" // 비디오 크기 조절 방식 ('cover', 'contain', 'stretch' 등)
              paused={true} // true일 경우 비디오가 일시정지됨
              repeat={false} // 비디오 반복 재생
            />
          ) : (
            <ContentText>프리미엄 회원이 되어보세요!</ContentText>
          )}
        </GIFContainer>
        <GraphContainer>
          <BarChart
            style={graphStyle}
            data={{
              labels: ['팔 각도', '자세 정렬', '무릎 각도' ],
              datasets: [
                {
                  data: solutionData?.criteriaDetailList.map(
                    criteria => criteria.score,
                  ),
                },
              ],
            }}
            width={350}
            height={220}
            chartConfig={chartConfig}
            fromZero={true}
            verticalLabelRotation={0}
            withInnerLines={true}
            withHorizontalLabels={true}
            fromNumber={100}
          />
        </GraphContainer>
        <TextContainer>
          <ContentText>
            {solutionData?.content || '내용이 없습니다.'}
          </ContentText>
        </TextContainer>
      </ContentContainer>
      <ButtonContainer>
      {premium ? (<RealButton
          onPress={() => navigation.navigate('Comparison', { exerciseId, videoUrl: `${solutionData.solutionVideoUrl}.mp4` })}>
          <RealButtonText>운동 전문가와 자세 비교하기</RealButtonText>
        </RealButton>):(<RealButton
          onPress={() => setModalVisible(true)}>
          <RealButtonText>운동 전문가와 자세 비교하기</RealButtonText>
        </RealButton>)}
      </ButtonContainer>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <ModalContainer>
          <ModalView>
            <ModalText>
              이 서비스는{' '}
              <Text
                style={{
                  color: '#3373eb',
                  fontWeight: 'bold',
                }}>
                프리미엄 회원
              </Text>
              만 이용가능합니다.
            </ModalText>
            <SubText>프리미엄 서비스를 구독하시겠습니까?</SubText>
            <ModalButtonContainer>
              <ConfirmButton onPress={() => navigation.navigate('PremiumUpgrade')}>
                <ButtonText style={{color: '#fff'}}>확인</ButtonText>
              </ConfirmButton>
              <CancelButton onPress={() => setModalVisible(false)}>
                <ButtonText>취소</ButtonText>
              </CancelButton>
            </ModalButtonContainer>
          </ModalView>
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
