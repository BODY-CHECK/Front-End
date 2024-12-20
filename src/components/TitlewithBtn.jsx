import styled from 'styled-components/native';

const TitlewithBtn = ({title, buttonText, onPress}) => {
  return (
    <HeaderWrapper>
      <Title>{title}</Title>
      <NavigateButton onPress={onPress}>
        <ButtonText>{buttonText}</ButtonText>
      </NavigateButton>
    </HeaderWrapper>
  );
};

export default TitlewithBtn;

const HeaderWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 6px;
  padding-right: 4px;
  width: 100%;
  margin-bottom: 16px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: black;
`;

const NavigateButton = styled.TouchableOpacity``;

const ButtonText = styled.Text`
  font-size: 12px;
  padding-top: 8px;
  color: #3373eb;
`;
