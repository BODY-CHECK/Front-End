import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import instance from '../../axiosInstance';
import Svg, {Circle} from 'react-native-svg';
import styled from 'styled-components/native';

LocaleConfig.locales['ko'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};

LocaleConfig.defaultLocale = 'ko';

const baseURL = 'https://dev.bodycheck.store';

const MyCalendar = () => {
  const [markedDates, setMarkedDates] = useState({});

  // 등급별 색상 설정
  const gradeColors = {
    1: '#FF0000', // 빨강
    2: '#F1930A', // 주황
    3: '#FFD700', // 노랑
    4: '#4BAA3D', // 초록
    5: '#3373eb', // 파랑
  };

  const fetchAttendanceDates = async yearMonth => {
    try {
      const response = await instance.get(
        `${baseURL}/api/attendances/list?yearMonth=${yearMonth}`,
      );

      if (response.data.isSuccess) {
        const dates = response.data.result.reduce((acc, attendance) => {
          const gradeColor = gradeColors[attendance.grade] || '#CCCCCC'; // 기본 색상 설정
          acc[attendance.date] = {
            selected: true,
            selectedColor: gradeColor,
            selectedTextColor: '#ffffff',
          };
          return acc;
        }, {});
        setMarkedDates(dates);
      } else {
        console.error(
          '출석 데이터를 가져오지 못했습니다:',
          response.data.message,
        );
      }
    } catch (error) {
      console.error('출석 데이터 API 호출 오류:', error);
    }
  };

  // 현재 월의 출석 데이터를 가져오기
  useEffect(() => {
    const date = new Date();
    const yearMonth = `${date.getFullYear()}.${String(
      date.getMonth() + 1,
    ).padStart(2, '0')}`;
    fetchAttendanceDates(yearMonth);
  }, []);

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onMonthChange={month => {
          const yearMonth = `${month.year}.${String(month.month).padStart(
            2,
            '0',
          )}`;
          fetchAttendanceDates(yearMonth);
        }}
        style={{
          width: 380,
        }}
      />
      {/* 범례 */}
      <LegendContainer>
        <LegendItem>
          <Svg height="10" width="10">
            <Circle cx="5" cy="5" r="5" fill="#FF0000" />
          </Svg>
          <LegendText>0-20점</LegendText>
        </LegendItem>
        <LegendItem>
          <Svg height="10" width="10">
            <Circle cx="5" cy="5" r="5" fill="#F1930A" />
          </Svg>
          <LegendText>21-40점</LegendText>
        </LegendItem>
        <LegendItem>
          <Svg height="10" width="10">
            <Circle cx="5" cy="5" r="5" fill="#FFD700" />
          </Svg>
          <LegendText>41-60점</LegendText>
        </LegendItem>
        <LegendItem>
          <Svg height="10" width="10">
            <Circle cx="5" cy="5" r="5" fill="#4BAA3D" />
          </Svg>
          <LegendText>61-80점</LegendText>
        </LegendItem>
        <LegendItem>
          <Svg height="10" width="10">
            <Circle cx="5" cy="5" r="5" fill="#3373eb" />
          </Svg>
          <LegendText>81-100점</LegendText>
        </LegendItem>
      </LegendContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});

export default MyCalendar;

const LegendContainer = styled.View`
  flex-direction: row;
  margin-top: 10px;
  margin-left: 16px;
`;

const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 3px;
`;

const LegendText = styled.Text`
  margin-left: 3px;
  margin-bottom: 3px;
  margin-right: 8px;
  font-size: 12px;
  font-weight: bold;
`;
