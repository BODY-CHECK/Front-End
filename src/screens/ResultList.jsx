import React, { useState, useEffect } from 'react';
import {
  Container,
  HealthContainer,
  HealthType,
  HealthList,
  HealthIcon,
  IconName,
  StyledImage,
  TypeButton,
  TypeButtonText,
  LabelContainer,
  TextContainer,
  AreaContainer,
  AreaText,
} from './ResultList.style';
import exerciseData from '../components/Health/HealthInfoData';
import { getSolutions } from '../api/SolutionApi'; // API 함수 임포트
import { ActivityIndicator, View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function ResultList({ navigation }) {
  // 현재 선택된 운동 종류를 관리하는 상태
  const [selectedType, setSelectedType] = useState('전체');
  const [solutionList, setSolutionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });

    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  });

  // selectedType이 변경될 때마다 API 요청으로 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchSolutions = async () => {
      setLoading(true);
      setError(null);
      let targetBody;
      switch (selectedType) {
        case '상체 운동':
          targetBody = 'UPPER_BODY';
          break;
        case '하체 운동':
          targetBody = 'LOWER_BODY';
          break;
        default:
          targetBody = 'NULL'; // 전체 운동
      }
      try {
        const response = await getSolutions(targetBody, 0, 0); // 선택된 운동 종류에 맞게 API 호출
        setSolutionList(response.result.solutionList);
      } catch (err) {
        console.error('Error during API call:', err);
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, [selectedType]);

  // 특정 운동 ID로 해당 운동 데이터를 찾는 함수
  const handleNavigate = exerciseId => {
    const exercise = solutionList.find(ex => ex.id === exerciseId);
    if (exercise) {
      navigation.navigate('Solution', { id: exercise.id }); // 데이터를 Solution 화면으로 전달
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <View><Text>{error}</Text></View>;
  }

  return (
    <Container>
      <HealthType>
        <TypeButton
          isActive={selectedType === '전체'}
          onPress={() => setSelectedType('전체')}>
          <TypeButtonText isActive={selectedType === '전체'}>
            전체
          </TypeButtonText>
        </TypeButton>
        <TypeButton
          isActive={selectedType === '상체 운동'}
          onPress={() => setSelectedType('상체 운동')}>
          <TypeButtonText isActive={selectedType === '상체 운동'}>
            상체 운동
          </TypeButtonText>
        </TypeButton>
        <TypeButton
          isActive={selectedType === '하체 운동'}
          onPress={() => setSelectedType('하체 운동')}>
          <TypeButtonText isActive={selectedType === '하체 운동'}>
            하체 운동
          </TypeButtonText>
        </TypeButton>
      </HealthType>
      <HealthContainer>
        {solutionList.map(exercise => {
          const localExercise = exerciseData.find(e => Number(e.id) === exercise.exerciseId);
          return (
            <HealthList key={exercise.id}>
              <HealthIcon onPress={() => handleNavigate(exercise.id)}>
                {localExercise ? <StyledImage source={localExercise.imageSource} /> : null}
                <LabelContainer>
                  <TextContainer>
                    <IconName>{localExercise ? localExercise.title : exercise.exerciseName}</IconName>
                  </TextContainer>
                  <AreaContainer>
                    <AreaText isFirst={true}>{exercise.exerciseDate}</AreaText>
                  </AreaContainer>
                </LabelContainer>
              </HealthIcon>
            </HealthList>
          );
        })}
      </HealthContainer>
    </Container>
  );
}