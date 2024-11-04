import React, {useState, useEffect} from 'react';
import {
  Container,
  ContentContainer,
  ContentText,
  GIFContainer,
  GraphContainer,
  StyledGIF,
  TextContainer,
} from './HealtResult.style';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {BarChart} from 'react-native-chart-kit';
import { getSolutionById } from '../api/SolutionApi'; // API 호출 함수 import

export default function Solution() {
  const route = useRoute();
  const {id} = route.params;
  const [solutionData, setSolutionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const response = await getSolutionById(id);
        setSolutionData(response.result);
      } catch (err) {
        console.error('Error during API call:', err);
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSolution();
  }, [id]);

  useFocusEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });

    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  });

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
    return <ContentText>로딩 중...</ContentText>;
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
            <StyledGIF source={{ uri: solutionData.solutionVideoUrl }} />
          ) : (
            <ContentText>비디오가 없습니다.</ContentText>
          )}
        </GIFContainer>
        <GraphContainer>
          <BarChart
            style={graphStyle}
            data={{
              labels: ['팔 각도', '자세 장렬', '무릎 각도'],
              datasets: [
                {
                  data: solutionData?.criteriaDetailList.map(criteria => criteria.score),
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
          />
        </GraphContainer>
        <TextContainer>
          {/* content를 렌더링 */}
          <ContentText>
            {solutionData?.content || '내용이 없습니다.'}
          </ContentText>
        </TextContainer>
        {/* criteriaDetailList는 주석 처리 */}
        {/*
        {solutionData?.criteriaDetailList.map((criteria, index) => (
          <View key={index}>
            <Text>기준 {criteria.criteriaIdx}: {criteria.criteriaName}</Text>
            <Text>점수: {criteria.score}</Text>
          </View>
        ))}
        */}
      </ContentContainer>
    </Container>
  );
}
