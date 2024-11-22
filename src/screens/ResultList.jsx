import React, {useState, useEffect} from 'react';
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
  PeriodContainer,
} from './ResultList.style';
import exerciseData from '../components/Health/HealthInfoData';
import {getSolutions} from '../api/SolutionApi'; // API 함수 임포트
import {ActivityIndicator} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';

export default function ResultList({navigation}) {
  // 현재 선택된 운동 종류를 관리하는 상태
  const [selectedType, setSelectedType] = useState('전체');
  const [solutionList, setSolutionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);

  // 현재 월을 가져오기
  const date = new Date();
  const currentMonth = date.getMonth() + 1; // 현재 월 (1월은 0부터 시작하므로 +1)

  // 선택 옵션 계산 함수
  const getMonthLabel = offset => {
    const month = (currentMonth - offset + 12) % 12 || 12; // 1월 이전은 12월로 돌아감
    return `${month}월`;
  };

  // 드롭다운 항목 설정
  const periodOptions = [
    {label: '전체', value: '0'},
    {label: getMonthLabel(0), value: '1'}, // 이번 달
    {label: getMonthLabel(1), value: '2'}, // 최근 1개월
    {label: getMonthLabel(2), value: '3'}, // 최근 2개월
    {label: getMonthLabel(3), value: '4'}, // 최근 3개월
  ];

  // 선택한 기간에 따라 서버로 보낼 값을 계산하는 함수
  const getPeriodForApi = selectedPeriod => {
    if (selectedPeriod === 0) return 0;
    return selectedPeriod; // 1, 2, 3, 4로 그대로 반환
  };

  // 스크롤이 끝에 도달했는지 확인하는 함수
  const handleScroll = ({nativeEvent}) => {
    const isEndReached =
      nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
      nativeEvent.contentSize.height - 20;

    // 스크롤이 끝에 도달하고, 로딩 중이 아니며, 다음 페이지가 있을 때
    if (isEndReached && !loading && hasNext) {
      console.log('스크롤 끝에 도달, 다음 페이지 요청:', page + 1);
      setPage(prevPage => prevPage + 1); // 다음 페이지로 이동
    }
  };

  // 페이지가 변경될 때마다 API 요청
  useEffect(() => {
    if (page > 0) {
      fetchSolutions(page);
    }
  }, [page]);

  console.log(selectedType);

  // API 요청 함수
  const fetchSolutions = async page => {
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

    const periodForApi = getPeriodForApi(selectedPeriod);

    try {
      // 서버에 `page` 값을 전송하여 데이터 요청
      const response = await getSolutions(targetBody, periodForApi, page);
      const newSolutions = response.result.solutionList;

      // 기존 데이터에 새로 받은 데이터를 추가
      setSolutionList(prevList => [...prevList, ...newSolutions]);

      // 다음 페이지 여부 확인
      if (response.result.hasNext) {
        setHasNext(true);
      } else {
        setHasNext(false);
      }
    } catch (err) {
      console.error('Error during API call:', err);
      setError('데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 첫 페이지 데이터를 요청
  useEffect(() => {
    setPage(0);
    setHasNext(true);
    setSolutionList([]);
    fetchSolutions(0);
  }, [selectedType, selectedPeriod]);

  // 특정 운동 ID로 해당 운동 데이터를 찾는 함수
  const handleNavigate = exerciseId => {
    const exercise = solutionList.find(ex => ex.id === exerciseId);
    if (exercise) {
      navigation.navigate('Solution', {id: exercise.id}); // 데이터를 Solution 화면으로 전달
    }
  };

  if (loading && page === 0) {
    return <ActivityIndicator size="large" />;
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
        <PeriodContainer>
          <Picker
            selectedValue={String(selectedPeriod)}
            onValueChange={itemValue => setSelectedPeriod(String(itemValue))}
            style={{height: 15, width: 100}}
            mode="dropdown">
            {periodOptions.map((option, index) => (
              <Picker.Item
                key={index}
                label={option.label}
                value={String(option.value)}
              />
            ))}
          </Picker>
        </PeriodContainer>
      </HealthType>
      <HealthContainer onScroll={handleScroll}>
        {solutionList.map(exercise => {
          const localExercise = exerciseData.find(
            e => Number(e.id) === exercise.exerciseId,
          );
          return (
            <HealthList key={exercise.id}>
              <HealthIcon onPress={() => handleNavigate(exercise.id)}>
                {localExercise ? (
                  <StyledImage source={localExercise.imageSource} />
                ) : null}
                <LabelContainer>
                  <TextContainer>
                    <IconName>
                      {localExercise
                        ? localExercise.title
                        : exercise.exerciseName}
                    </IconName>
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
