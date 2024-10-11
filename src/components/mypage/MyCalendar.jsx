import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Calendar} from 'react-native-calendars';

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <View style={styles.container}>
      <Calendar
        // month 이름 및 화살표 버튼 스타일링
        theme={{
          calendarBackground: '#ffffff', // 캘린더 배경색
          textSectionTitleColor: '#555', // 요일 이름 색상
          textDayHeaderFontWeight: 'bold', // 요일 텍스트 두께
          textDayHeaderFontSize: 14, // 요일 텍스트 크기
          textMonthFontWeight: 'bold', // 월 이름 두께
          textMonthFontSize: 18, // 월 텍스트 크기
          arrowColor: 'gray', // 화살표 색상
        }}
        // 날짜 선택 처리 및 마킹
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#1e90ff', // 선택된 날짜 배경색
            selectedTextColor: '#ffffff', // 선택된 날짜 텍스트 색상
          },
          // 예시로 며칠 마킹
          '2024-09-04': {marked: true, dotColor: '#1e90ff'},
          '2024-09-05': {marked: true, dotColor: '#1e90ff'},
          '2024-09-06': {marked: true, dotColor: '#1e90ff'},
          '2024-09-02': {marked: true, dotColor: '#1e90ff'},
          '2024-09-03': {marked: true, dotColor: '#1e90ff'},
        }}
        // 기본 스타일링
        style={{
          width: 400,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  selectedDateText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MyCalendar;
