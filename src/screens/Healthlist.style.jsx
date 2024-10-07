import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: white;
`;

export const HealthContainer = styled.ScrollView`
  ovewflow-y: auto;
`;

export const HealthType = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: black;
  margin-left: 5px;
`;

export const HealthList = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
`;

export const HealthIcon = styled.TouchableOpacity`
  width: 105px;
  margin: 10px;
`;

export const IconName = styled.Text`
  text-align: center;
  text-justify: center;
  font-size: 14px;
  font-weight: bold;
  color: black;
  width: 100%;
  height: 20px;
`;

export const StyledImage = styled.Image`
  width: 105px;
  height: 105px;
  border-width: 1px;
  border-color: #3373eb;
  border-radius: 15px;
  padding: 2px;
`;
