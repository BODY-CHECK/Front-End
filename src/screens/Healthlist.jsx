import React, {useState} from 'react';
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
} from './Healthlist.style';
import exerciseData from '../components/Health/HealthInfoData';

export default function Healthlist({navigation}) {
  // 현재 선택된 운동 종류를 관리하는 상태
  const [selectedType, setSelectedType] = useState('전체');

  // 상체 운동과 하체 운동 필터링 함수
  const filterExercises = () => {
    if (selectedType === '상체 운동') {
      return exerciseData.filter(ex => ex.type === '상체');
    } else if (selectedType === '하체 운동') {
      return exerciseData.filter(ex => ex.type === '하체');
    } else {
      return exerciseData; // '전체'가 선택되면 모든 운동을 보여줌
    }
  };

  // 특정 운동 ID로 해당 운동 데이터를 찾는 함수
  const handleNavigate = exerciseId => {
    const exercise = exerciseData.find(ex => ex.id === exerciseId);
    if (exercise) {
      //navigation.navigate('WelcomePage');
      navigation.navigate('HealthInfo', {id: exercise.id}); // 데이터를 HealthInfo 화면으로 전달
    }
  };

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
        {filterExercises().map(exercise => (
          <HealthList key={exercise.id}>
            <HealthIcon onPress={() => handleNavigate(exercise.id)}>
              <StyledImage source={exercise.imageSource} />
              <LabelContainer>
                <TextContainer>
                  <IconName>{exercise.title}</IconName>
                </TextContainer>
                <AreaContainer>
                  <AreaText isFirst={true}> {exercise.targetMuscle} </AreaText>
                  <AreaText> {exercise.mainMuscle} </AreaText>
                </AreaContainer>
              </LabelContainer>
            </HealthIcon>
          </HealthList>
        ))}
      </HealthContainer>
    </Container>
  );
}
