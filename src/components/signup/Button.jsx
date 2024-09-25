import styled from 'styled-components';

const Button = ({title, onPress, disabled}) => {
  return (
    <StyledButton onPress={onPress} disabled={disabled}>
      <ButtonText>{title}</ButtonText>
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.View`
  height: 50px;
  background-color: ${props => (props.disabled ? '#ccc' : '#3373eb')};
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  width: 90%;
  margin-top: auto;
  margin-bottom: 50px;
`;
const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
`;
