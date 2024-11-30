import React, {useState} from 'react';
import styled from 'styled-components/native';
import instance from '../axiosInstance'; // Axios 설정된 인스턴스 import

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setMessage('이메일을 입력해주세요.');
      return;
    }

    setLoading(true);
    setMessage(''); // 메시지 초기화
    try {
      const response = await instance.post('/members/emails/send-new-pw', {
        email,
      });

      if (response.data.isSuccess) {
        setMessage(response.data.message);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('비밀번호 재발급 요청 오류:', error);
      setMessage(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>비밀번호 재설정</Title>
      <Input
        placeholder="이메일을 입력하세요"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <ResetButton onPress={handlePasswordReset} disabled={loading}>
        <ButtonText>
          {loading ? '요청 중...' : '비밀번호 재발급 요청'}
        </ButtonText>
      </ResetButton>
      {message ? <Message>{message}</Message> : null}
    </Container>
  );
};

export default ResetPassword;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #fff;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Input = styled.TextInput`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
`;

const ResetButton = styled.TouchableOpacity`
  background-color: #3373eb;
  padding: 15px 30px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const Message = styled.Text`
  margin-top: 20px;
  font-size: 14px;
  color: ${props =>
    props.children.includes('카카오') || props.children.includes('없')
      ? 'red'
      : 'green'};
`;
