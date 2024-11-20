import React, {useEffect, useState} from 'react';
import {Alert, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import instance from '../axiosInstance';

const SubscriptionHandler = () => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await instance.get('/payment/subscribe/status');
        if (response.status === 200 && response.data.isSuccess) {
          const {logExist, status, last_approved_at} = response.data.result;

          // 날짜 계산
          const lastApprovedDate = new Date(last_approved_at);
          const currentDate = new Date();
          const diffInDays =
            (currentDate - lastApprovedDate) / (1000 * 60 * 60 * 24);

          if (!logExist || (status === 'INACTIVE' && diffInDays > 30)) {
            navigation.replace('PremiumUpgrade'); // 프리미엄 업그레이드 페이지
          } else if (logExist && status === 'ACTIVE') {
            navigation.replace('IsPremium'); // 구독 유지 화면
          } else if (logExist && status === 'INACTIVE' && diffInDays <= 30) {
            navigation.replace('IsPremiumWithoutCancel'); // 프리미엄 유지 예정 화면
          } else {
            Alert.alert('알 수 없는 구독 상태입니다.');
          }
        } else {
          Alert.alert('구독 상태를 확인할 수 없습니다.');
        }
      } catch (error) {
        console.error('구독 상태 확인 오류:', error);
        Alert.alert('오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [navigation]);

  if (loading) {
    return <ActivityIndicator size="large" color="#3373eb" />;
  }

  return null;
};

export default SubscriptionHandler;
