import React, {useEffect, useState} from 'react';
import {Button} from 'react-native';
import Svg, {Circle, G, Polygon, Rect, Text as SvgText} from 'react-native-svg';
import styled from 'styled-components/native';
import instance from '../../axiosInstance';

const graphWidth = 360; // 그래프 너비 고정
const underweightWidth = (3.5 / 10) * graphWidth; // 133px
const normalWeightWidth = (1.5 / 10) * graphWidth; // 57px
const overweightWidth = (1.5 / 10) * graphWidth; // 57px
const obesityWidth = (3.5 / 10) * graphWidth; // 133px
const baseURL = 'https://dev.bodycheck.store';

const BMIGraph = () => {
  const [height, setHeight] = useState(''); // cm로 입력받기
  const [weight, setWeight] = useState(''); // kg로 입력받기
  const [bmi, setBmi] = useState(null);

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

  // BMI 값에 따른 그래프 내 위치 계산 (저체중 ~ 비만)
  const bmiPosition = () => {
    const totalWidth =
      underweightWidth + normalWeightWidth + overweightWidth + obesityWidth;

    if (bmi <= 18.5) return (bmi / 18.5) * underweightWidth;
    if (bmi <= 25)
      return (
        underweightWidth + ((bmi - 18.5) / (25 - 18.5)) * normalWeightWidth
      );
    if (bmi <= 30)
      return (
        underweightWidth +
        normalWeightWidth +
        ((bmi - 25) / (30 - 25)) * overweightWidth
      );
    return (
      underweightWidth +
      normalWeightWidth +
      overweightWidth +
      ((bmi - 30) / (40 - 30)) * obesityWidth
    );
  };

  return (
    <Container>
      <Title>BMI</Title>

      {/* 그래프 영역 */}
      <Svg height="80" width={graphWidth} style={{marginBottom: 20}}>
        {/* 저체중 (파란색) */}
        <Rect
          x="0"
          y="40"
          width={underweightWidth}
          height="20"
          fill="#36A5DF"
          stroke="white"
          strokeWidth="2"
          rx="10"
          ry="10"
        />
        {/* 정상 (초록색) */}
        <Rect
          x={underweightWidth}
          y="40"
          width={normalWeightWidth}
          height="20"
          fill="#4BAA3D"
          stroke="white"
          strokeWidth="2"
          rx="10"
          ry="10"
        />
        {/* 과체중 (주황색) */}
        <Rect
          x={underweightWidth + normalWeightWidth}
          y="40"
          width={overweightWidth}
          height="20"
          fill="#F1930A"
          stroke="white"
          strokeWidth="2"
          rx="10"
          ry="10"
        />
        {/* 비만 (빨간색) */}
        <Rect
          x={underweightWidth + normalWeightWidth + overweightWidth}
          y="40"
          width={obesityWidth}
          height="20"
          fill="#D32028"
          stroke="white"
          strokeWidth="2"
          rx="10"
          ry="10"
        />

        {/* BMI 값 표시 말풍선 */}
        {bmi && (
          <G>
            {/* 말풍선 */}
            <Rect
              x={bmiPosition() - 20} // 말풍선 위치 조정
              y="10"
              width="40"
              height="20"
              rx="10"
              ry="10"
              fill="gray"
            />
            {/* 말풍선 내부 텍스트 */}
            <SvgText
              x={bmiPosition()}
              y="25"
              fontSize="12"
              fill="white"
              textAnchor="middle">
              {bmi}
            </SvgText>
            {/* 말풍선 꼬리 */}
            <Polygon
              points={`${bmiPosition() - 5},30 ${
                bmiPosition() + 5
              },30 ${bmiPosition()},40`}
              fill="gray"
            />
          </G>
        )}

        {/* 그래프 아래 텍스트 (18.5, 25, 30 구분) */}
        <SvgText x={underweightWidth} y="75" fontSize="12" textAnchor="middle">
          18.5
        </SvgText>
        <SvgText
          x={underweightWidth + normalWeightWidth}
          y="75"
          fontSize="12"
          textAnchor="middle">
          25
        </SvgText>
        <SvgText
          x={underweightWidth + normalWeightWidth + overweightWidth}
          y="75"
          fontSize="12"
          textAnchor="middle">
          30
        </SvgText>
      </Svg>

      {/* 범례 */}
      <LegendContainer>
        <LegendItem>
          <Svg height="10" width="10">
            <Circle cx="5" cy="5" r="5" fill="#36A5DF" />
          </Svg>
          <LegendText>저체중</LegendText>
        </LegendItem>
        <LegendItem>
          <Svg height="10" width="10">
            <Circle cx="5" cy="5" r="5" fill="#4BAA3D" />
          </Svg>
          <LegendText>정상</LegendText>
        </LegendItem>
        <LegendItem>
          <Svg height="10" width="10">
            <Circle cx="5" cy="5" r="5" fill="#F1930A" />
          </Svg>
          <LegendText>과체중</LegendText>
        </LegendItem>
        <LegendItem>
          <Svg height="10" width="10">
            <Circle cx="5" cy="5" r="5" fill="#D32028" />
          </Svg>
          <LegendText>비만</LegendText>
        </LegendItem>
      </LegendContainer>

      {/* 키와 몸무게 입력 */}
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

      <Button title="계산" onPress={calculateBMI} color="#3373eb" />
    </Container>
  );
};

// styled-components 스타일 정의
const Container = styled.View`
  padding: 20px;
  background-color: #fff;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: black;
`;

const LegendContainer = styled.View`
  flex-direction: row;
  margin-left: 10px;
`;

const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LegendText = styled.Text`
  margin-left: 3px;
  margin-bottom: 3px;
  margin-right: 8px;
  font-size: 12px;
  font-weight: bold;
`;

const InputContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;

  margin-bottom: 10px;
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #ccc;
  padding: 10px;
  width: 45%;
`;

export default BMIGraph;
