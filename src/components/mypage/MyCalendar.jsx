import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import instance from '../../axiosInstance';

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

  const fetchAttendanceDates = async yearMonth => {
    try {
      const response = await instance.get(
        `${baseURL}/api/attendances/list?yearMonth=${yearMonth}`,
      );

      if (response.data.isSuccess) {
        const dates = response.data.result.reduce((acc, attendance) => {
          acc[attendance.date] = {
            selected: true,
            selectedColor: '#3373eb',
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
