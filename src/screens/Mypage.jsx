import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {Button} from 'react-native';
import instance from '../axiosInstance';
import BMIGraph from '../components/mypage/BMIGraph';
import MyCalendar from '../components/mypage/MyCalendar';
import MypageHeader from '../components/mypage/MypageHeader';
import ToSolutionButton from '../components/mypage/ToSoulutionButton';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';


const baseURL = 'https://dev.bodycheck.store';

function MyPage() {
  const [nickname, setNickname] = useState('');
  const [bmi, setBmi] = useState(null); // BMI 값
  const [height, setHeight] = useState(''); // cm로 입력받기
  const [weight, setWeight] = useState(''); // kg로 입력받기
  const bottomSheetRef = useRef(null); // BottomSheet 참조
  const snapPoints = useMemo(() => ['20%'], []);

  // 커스텀 backdrop (배경)
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1} // 닫힐 때 배경 흐림 효과 제거
        opacity={0.7} // 배경의 흐림도 설정
      />
    ),
    [],
  );

  // BottomSheet 열기 함수
  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  // 초기 데이터 로드 (키, 몸무게)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await instance.get(`${baseURL}/members/my-page`); // 실제 API 엔드포인트로 변경
        if (response.data.isSuccess) {
          const {height, weight} = response.data.result;
          setHeight(height.toString());
          setWeight(weight.toString());
          calculateBMI(height, weight); // BMI 자동 계산
        }
      } catch (error) {
        console.error('사용자 데이터 불러오기 실패:', error);
      }
    };
    fetchUserData();
  }, []);

  // BMI 계산 함수 (cm를 m로 변환)
  const calculateBMI = () => {
    const h = parseFloat(height) / 100; // cm -> m
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const bmiValue = (w / (h * h)).toFixed(1);
      setBmi(bmiValue);
    }
  };

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        // 서버에서 사용자 정보 가져오기
        const response = await instance.get(`${baseURL}/members/my-page`); // 해당 엔드포인트로 변경
        if (response.data.isSuccess) {
          setNickname(response.data.result.nickname); // 닉네임 저장
        } else {
          console.error('닉네임을 가져오지 못했습니다.');
        }
      } catch (error) {
        console.error('닉네임 가져오기 오류:', error);
      }
    };
    fetchNickname();
  }, []);

  return (
    <ScrollContainer>
      <Container>
        <MypageHeader nickname={nickname} />
        <MyCalendar />
        <BMIGraph onEdit={openBottomSheet} height={height} weight={weight} bmi={bmi}/>
      </Container>
      <ToSolutionButton />
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
      >
        <InputContainer>
          <Input
            placeholder="키 (cm)"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
          <Input
            placeholder="몸무게 (kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
        </InputContainer>
        <Button title="계산하기" onPress={() => calculateBMI()} />
      </BottomSheet>
    </ScrollContainer>
  );
}

const ScrollContainer = styled.ScrollView`
  flex: 1;
  background-color: #fff;
`
const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #fff;
  padding: 20px;
`;
const InputContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-vertical: 10px;
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #ccc;
  padding: 10px;
  height: 50px;
  width: 45%;
`;

export default MyPage;
