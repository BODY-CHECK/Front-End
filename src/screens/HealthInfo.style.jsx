import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: white;
`;

export const HeaderContainer = styled.View`
  background-color: white;
`;

export const HealthType = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: black;
  margin-left: 5px;
`;

export const ContentContainer = styled.ScrollView`
  flex: 1;
`;

export const GIFContainer = styled.View`
  margin-top: 10px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid black;
`;

export const StyledGIF = styled.Image`
  width: 50%;
  height: 100%;
  border-width: 1px;
  border-radius: 10px;
`;

export const TextContainer = styled.View`
  padding: 10px;
  background-color: white;
  border: 1px solid #999999;
  border-radius: 5px;
  margin-top: 10px;
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  max-width: 400px;
  height: 50px;
  padding: 15px;
  margin-top: 10px;
  background-color: #3373eb;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const TitleText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: black;
  margin-bottom: 10px;
`;

export const ContentText = styled.Text`
  color: black;
`;

export const InfoContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 10px;
`;


// 난이도에 따른 색상 설정 함수
const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case '초급':
      return '#4AD926'; // 초록색
    case '중급':
      return '#F1930A'; // 주황색
    case '상급':
      return '#D32028'; // 빨간색
    default:
      return '#6C757D'; // 기본 회색
  }
};

// 기본 텍스트 스타일
export const BaseText = styled.Text`
  font-size: 12px;
  color: white;
  height: 20px;
  padding: 2px;
  border-radius: 10px;
  margin-right: 5px;
`;

// 난이도 텍스트 스타일
export const DifficultyText = styled(BaseText)`
  background-color: ${(props) => getDifficultyColor(props.difficulty)};
`;

// 타겟 머슬, 주운동 부위, 부운동 부위 텍스트 스타일
export const TargetMuscleText = styled(BaseText)`
  background-color: #3373EB;
`;

export const MainMuscleText = styled(BaseText)`
  background-color: #6293EF;
`;

export const SecondaryMuscleText = styled(BaseText)`
  background-color: ${({secondaryMuscle}) => secondaryMuscle ? '#9FB9EA' : 'transparent'};
`;
