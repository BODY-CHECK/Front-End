import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import ProfileInput from '../components/settings/ProfileInput';
import instance from '../axiosInstance';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ConfirmModal from '../components/ConfirmModal';
import ExerciseSelection from '../components/settings/ExerciseSelection';

const baseURL = 'https://dev.bodycheck.store';

const ProfileEdit = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmModalVisible, setConirmModalVisible] = useState(false); // 모달 상태
  const [confirmModalMessage, setConfirmModalMessage] = useState(''); // 모달 메시지
  const [exerciseType, setExerciseType] = useState(''); // 선호 운동 부위 상태 추가

  const navigation = useNavigation();

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        // 서버에서 사용자 정보 가져오기
        const response = await instance.get(`${baseURL}/members/my-page`); // 해당 엔드포인트로 변경
        if (response.data.isSuccess) {
          setEmail(response.data.result.email);
          setNickname(response.data.result.nickname || '사용자'); // 닉네임이 null이면 '사용자'로 설정
          setExerciseType(response.data.result.exerciseType); // 기본값 설정
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
    if (!name || name.trim() === '') {
      return '닉네임을 입력해주세요'; // 닉네임이 null이거나 빈 값일 경우 에러 메시지
    }
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
    console.log('닉네임 값:', nickname); // 닉네임 값 출력
    console.log('선호 운동 부위 값:', exerciseType); // 선택한 선호 운동 부위 출력

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
          exerciseType: exerciseType, // 선택한 선호 운동 부위 추가
        },
      );
      if (response.data.isSuccess) {
        setConirmModalVisible(true);
        setConfirmModalMessage('성공적으로 프로필이 수정되었습니다.');
      } else {
        setConirmModalVisible(true);
        setConfirmModalMessage(response.data.message);
      }
    } catch (error) {
      console.error('닉네임 수정 오류:', error);
      // 500 오류 상세 데이터 출력
      if (error.response) {
        console.error('응답 상태 코드:', error.response.status);
        console.error('응답 헤더:', error.response.headers);
        console.error('응답 데이터:', error.response.data);
        Alert.alert(
          '서버 오류',
          '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        );
      } else {
        console.error('요청 전송 오류:', error.message);
        Alert.alert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleConfirmClick = () => {
    navigation.navigate('Mypage');
    setConirmModalVisible(false);
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
      <ExerciseSelection value={exerciseType} onChange={setExerciseType} />
      <EditButton onPress={handleEdit}>
        <ButtonText>수정하기</ButtonText>
      </EditButton>
      <ConfirmModal
        visible={confirmModalVisible}
        message={confirmModalMessage}
        onConfirm={handleConfirmClick}
      />
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
