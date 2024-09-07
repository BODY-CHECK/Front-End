import React, {useState} from 'react';
import styled from 'styled-components/native';

const LoginForm = ({onLogin}) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const onLoginHandler = () => {
    // 폼 제출 및 페이지 새로고침 방지 대신 Native에서는 직접 함수 호출
    onLogin(id, password);
  };

  return (
    <FormContainer>
      <Input placeholder="E-mail 입력하기" onChangeText={setId} value={id} />
      <Input
        placeholder="비밀번호 입력하기"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <CheckboxContainer>
        <Checkbox />
        <CheckboxLabel>로그인 상태 유지하기</CheckboxLabel>
      </CheckboxContainer>
      <Button onPress={onLoginHandler}>
        <ButtonText>로그인</ButtonText>
      </Button>
    </FormContainer>
  );
};

export default LoginForm;

const FormContainer = styled.View`
  display: flex;
  flex-direction: column;

  justify-content: center;
  width: 100%;
  margin-bottom: 10px;
`;

const Input = styled.TextInput`
  width: 100%;
  height: 50px;
  padding: 10px 15px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 50px;
  font-size: 14px;
`;

const CheckboxContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
  margin-bottom: 20px;
`;

const Checkbox = styled.Switch.attrs(() => ({
  trackColor: {false: '#767577', true: '#81b0ff'},
  thumbColor: '#f4f3f4',
}))``;

const CheckboxLabel = styled.Text`
  font-size: 14px;
`;

const Button = styled.TouchableOpacity`
  width: 100%;
  max-width: 400px;
  height: 50px;
  padding: 15px;
  margin-top: 30px;
  background-color: #10d99b;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
