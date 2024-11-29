import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import instance from '../../axiosInstance';

const PasswordInput = ({password, setPassword, setErrors}) => {
  const [loading, setLoading] = useState(false);
  const typingTimeoutRef = useRef(null); // 타이머를 저장할 참조

  const handlePasswordChange = text => {
    setPassword(text);
    setErrors({}); // 오류 초기화

    // 이전 타이머 정리
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // 새 타이머 시작
    typingTimeoutRef.current = setTimeout(() => {
      validatePassword(text);
    }, 3000); // 3초 대기
  };

  const validatePassword = async password => {
    if (password.length === 0) {
      setLoading(false); // 빈 입력 시 로딩 해제
      return;
    }
    setLoading(true);
    try {
      const response = await instance.post('/members/verify-password', {
        pw: password,
      });
      console.log('비밀번호 검증 API 응답:', response.data);

      if (!response.data.isSuccess) {
        setErrors({password: '비밀번호를 다시 확인해 주세요.'});
      } else {
        setErrors({}); // 오류 초기화
      }
    } catch (error) {
      console.error('비밀번호 검증 중 오류:', error);
      setErrors({password: '비밀번호 검증 중 오류가 발생했습니다.'});
    } finally {
      setLoading(false); // 로딩 상태를 반드시 해제
    }
  };

  return (
    <InputWrapper>
      <Input
        secureTextEntry
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChangeText={handlePasswordChange}
      />
      {loading && <LoadingText>검증 중...</LoadingText>}
    </InputWrapper>
  );
};

export default PasswordInput;

const InputWrapper = styled.View`
  width: 100%;
  margin-bottom: 10px;
`;

const Input = styled.TextInput`
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
  color: #333;
`;

const LoadingText = styled.Text`
  margin-top: 5px;
  font-size: 12px;
  color: #aaa;
`;
