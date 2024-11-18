import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: white;
`;

export const HealthContainer = styled.ScrollView`
  ovewflow-y: auto;
`;

export const HealthType = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const PeriodContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
`;

export const HealthList = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
`;

export const HealthIcon = styled.TouchableOpacity`
  width: 98%;
  flex-direction: row;
  margin: 5px;
  border: 0.5px solid #999999;
  border-radius: 10px;
  padding: 10px 8px;
`;

export const LabelContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  width: 78%;
  height: 80px;
`;

export const TextContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  height: 50%;
  width: 100%;
`;

export const AreaContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  height: 50%;
  width: 100%;
`;

export const IconName = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: black;
  height: 20px;
  margin-left: 20px;
  margin-top: 30px;
`;

export const AreaText = styled.Text`
  font-size: 9px;
  font-weight: bold;
  color: white;
  background-color: #3373eb;
  height: 22px;
  margin-top: 20px;
  padding: 4px 12px 4px 12px;
  border-radius: 5px;
  margin-left: ${props => (props.isFirst ? '20px' : '5px')};
`;

export const StyledImage = styled.Image`
  width: 80px;
  height: 80px;
  padding: 2px;
  margin-left: 5px;
`;

export const TypeButton = styled.TouchableOpacity`
  width: 68px;
  height: 30px;
  background-color: ${({isActive}) => (isActive ? 'black' : 'white')};
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  margin-bottom: 5px;
  border: 1px solid black;
`;

export const TypeButtonText = styled.Text`
  color: ${({isActive}) => (isActive ? 'white' : 'black')};
  font-size: 10px;
  font-weight: bold;
`;
