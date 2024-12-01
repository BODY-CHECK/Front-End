import React, {useState} from 'react';
import styled from 'styled-components/native';
import instance from '../axiosInstance'; // Axios 설정된 인스턴스 import

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false); // 오류 여부 상태

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setMessage('이메일을 입력해주세요.');
      setError(true); // 오류 상태 설정
      return;
    }

    setLoading(true);
    setMessage(''); // 메시지 초기화
    setError(false); // 오류 상태 초기화
    try {
      const response = await instance.post('/members/emails/send-new-pw', {
        email,
      });

      if (response.data.isSuccess) {
        setMessage('새 비밀번호를 발급받았습니다.\n이메일을 확인해주세요.');
        setError(false);
      } else {
        setMessage(response.data.message);
        setError(true);
      }
    } catch (error) {
      console.error('비밀번호 재발급 요청 오류:', error);
      setMessage(
        error.response?.data?.message || '요청 중 오류가 발생했습니다.',
      );
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>새 비밀번호를 발급받기 위해</Title>
      <Title>이메일을 입력해주세요.</Title>
      <InputWrapper>
        <Input
          placeholder="email@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={error} // 오류 여부 전달
        />
        {error && <ErrorMessage>{message}</ErrorMessage>}
      </InputWrapper>
      <BtnWrapper>
        {message && !error && <SuccessMessage>{message}</SuccessMessage>}
        <ResetButton onPress={handlePasswordReset} disabled={loading}>
          <ButtonText>{loading ? '요청 중...' : '발급받기'}</ButtonText>
        </ResetButton>
      </BtnWrapper>
    </Container>
  );
};

export default ResetPassword;

// Styled Components
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 140px 20px 20px 20px;
  background-color: #fff;
  text-align: center;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: black;
`;

const InputWrapper = styled.View`
  width: 100%;
  margin-bottom: 20px;
`;

const Input = styled.TextInput`
  width: 100%;
  border: 1px solid ${props => (props.error ? '#DD4343' : '#ddd')};
  padding: 10px;
  height: 40px;
  font-size: 16px;
  margin-top: 50px;
`;

const ErrorMessage = styled.Text`
  color: #dd4343;
  font-size: 12px;
  margin-top: 5px;
`;

const BtnWrapper = styled.View`
  flex-direction: column;
  margin-top: auto;
  width: 100%;
`;

const SuccessMessage = styled.Text`
  color: green;
  font-size: 14px;
  text-align: center;
  margin-bottom: 10px;
`;

const ResetButton = styled.TouchableOpacity`
  background-color: #3373eb;
  height: 40px;
  align-items: center;
  justify-content: center;
  width: 100%;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 14px;
`;
