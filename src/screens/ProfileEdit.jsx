import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import ProfileInput from '../components/settings/ProfileInput';
import instance from '../axiosInstance';
import {Alert} from 'react-native';

const baseURL = 'https://dev.bodycheck.store';

const ProfileEdit = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        // 서버에서 사용자 정보 가져오기
        const response = await instance.get(`${baseURL}/members/my-page`); // 해당 엔드포인트로 변경
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

  // 닉네임 유효성 검사
  const validateNickname = async name => {
    if (name.length > 10) {
      return '닉네임은 10자 이내로 입력해주세요';
    }
    const regex = /^[A-Za-z0-9가-힣-_]*$/;
    if (!regex.test(name)) {
      return '영문 대/소문자, 한글, 숫자, 하이픈(-), 언더스코어(_)만 사용해주세요';
    }
    return '';
  };

  // 수정하기 버튼 클릭 시 호출
  const handleEdit = async () => {
    const error = await validateNickname(nickname);
    if (error) {
      setErrorMessage(error);
      return;
    }

    try {
      const response = await instance.post(
        `${baseURL}/members/setting/profile`,
        {
          nickname: nickname,
        },
      );
      if (response.data.isSuccess) {
        Alert.alert('닉네임이 성공적으로 수정되었습니다.');
      } else {
        Alert.alert('닉네임 수정 실패:', response.data.message);
      }
    } catch (error) {
      console.error('닉네임 수정 오류:', error);
      Alert.alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Container>
      <ProfileInput
        label="이메일 아이디"
        value={email}
        editable={false} // 수정 불가
      />
      <ProfileInput
        label="닉네임"
        placeholder="닉네임"
        value={nickname}
        onChangeText={async text => {
          setNickname(text);
          setErrorMessage(await validateNickname(text));
        }}
        errorMessage={errorMessage}
      />
      <EditButton onPress={handleEdit}>
        <ButtonText>수정하기</ButtonText>
      </EditButton>
    </Container>
  );
};

export default ProfileEdit;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;

const EditButton = styled.TouchableOpacity`
  background-color: #3373eb;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-top: auto;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 14px;
`;
