import styled from 'styled-components/native';
import Lock from '../assets/images/lock.png';
import ProfileInput from '../components/settings/ProfileInput';
import {useEffect, useState} from 'react';
import instance from '../axiosInstance';
import PasswordInput from '../components/settings/PasswordInput';
import {useNavigation} from '@react-navigation/native';

const PWAuthentication = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isPasswordValid, setIsPasswordValid] = useState(false); // 비밀번호 검증 성공 여부

  const navigation = useNavigation();

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        // 서버에서 사용자 정보 가져오기
        const response = await instance.get(`/members/my-page`); // 해당 엔드포인트로 변경
        if (response.data.isSuccess) {
          setEmail(response.data.result.email);
        } else {
          console.error('이메일을 가져오지 못했습니다.');
        }
      } catch (error) {
        console.error('이메일 가져오기 오류:', error);
      }
    };
    fetchEmail();
  }, []);

  return (
    <Container>
      <LockImg source={Lock} />
      <TitleWrapper>
        <Title>회원님의 안전한 개인정보를 위해</Title>
        <RowWrapper>
          <BlueTitle>인증 절차</BlueTitle>
          <Title>가 필요해요.</Title>
        </RowWrapper>
      </TitleWrapper>
      <SubTitle>로그인 계정으로 재인증을 진행해 주세요.</SubTitle>
      <ProfileInput
        value={email}
        editable={false} // 수정 불가
      />
      <PasswordInput
        password={password}
        setPassword={setPassword}
        setErrors={setErrors}
        setIsPasswordValid={setIsPasswordValid} // 검증 성공 여부 전달
      />
      {errors.password && <ErrorText>{errors.password}</ErrorText>}
      <StyledButton
        disabled={!isPasswordValid}
        onPress={() => navigation.navigate('PasswordChange')}>
        <ButtonText>확인</ButtonText>
      </StyledButton>
    </Container>
  );
};

export default PWAuthentication;

const Container = styled.View`
  flex: 1;
  padding: 20px;
  align-items: center;
  background-color: #fff;
`;

const LockImg = styled.Image`
  margin-top: 40px;
  width: 50px;
  height: 50px;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: black;
`;

const SubTitle = styled.Text`
  font-size: 12px;
  margin-top: 20px;
  margin-bottom: 30px;
`;

const TitleWrapper = styled.View`
  flex-direction: column;
  align-items: center;
`;

const BlueTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #3373eb;
`;

const RowWrapper = styled.View`
  flex-direction: row;
`;
const ErrorText = styled.Text`
  align-self: flex-start;
  color: red;
  font-size: 12px;
  margin-bottom: 10px;
`;

const StyledButton = styled.TouchableOpacity`
  height: 50px;
  background-color: ${props => (props.disabled ? '#ccc' : '#3373eb')};
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 50px;
`;
const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
`;
