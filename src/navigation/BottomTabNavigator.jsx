import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import Home from '../screens/Home';
import Routine from '../screens/Routine';
import HeaderMain from '../components/HeaderMain';
import HealthStackNavigator from './HealthStackNavigator';
import MypageStackNavigator from './SettingsStackNavigator';
import {
  getFocusedRouteNameFromRoute,
  useNavigationState,
} from '@react-navigation/native';
import RoutineStackNavigator from './RoutineStackNavigator';
import HomeHealthStackNavigator from './HomeHealthStackNavigator';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const getTabBarStyle = route => {
    // 특정 라우트에서만 TabBar 숨기기
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';
    const routesToHideTabBar = [
      'PremiumUpgrade',
      'IsPremium',
      'SettingScreen',
      'ResultList',
      'Solution',
      'ProfileEdit',
      'PasswordChange',
      'HealthInfo',
      'Health',
      'HealthResult',
      'Loading',
      'Subscribe',
      'HomeHealthInfo',
    ];

    if (routesToHideTabBar.includes(routeName)) {
      return {display: 'none'}; // 숨김
    }
    return {
      height: 70,
      borderTopWidth: 1,
      borderTopColor: '#E5E5E5',
      backgroundColor: '#ffffff',
    };
  };

  return (
    <Tab.Navigator
      initialRouteName="홈"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let iconSource;

          if (route.name === '홈') {
            iconSource = focused
              ? require('../assets/images/outline_home.png')
              : require('../assets/images/icon_home.png');
          } else if (route.name === 'AI 피티') {
            iconSource = focused
              ? require('../assets/images/outline_pt.png')
              : require('../assets/images/icon_pt.png');
          } else if (route.name === '운동 루틴') {
            iconSource = focused
              ? require('../assets/images/outline_routine.png')
              : require('../assets/images/icon_routine.png');
          } else if (route.name === '마이페이지') {
            iconSource = focused
              ? require('../assets/images/outline_mypage.png')
              : require('../assets/images/icon_mypage.png');
          }

          return <Image source={iconSource} style={{width: 30, height: 30}} />;
        },
        tabBarActiveTintColor: '#3373EB',
        tabBarInactiveTintColor: '#1C1B1F',
        tabBarStyle: getTabBarStyle(route),
        tabBarLabelStyle: {
          marginBottom: 8,
        },
        headerTitle: () => <HeaderMain />,
      })}>
      <Tab.Screen
        name="홈"
        component={HomeHealthStackNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="AI 피티"
        component={HealthStackNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="운동 루틴"
        component={RoutineStackNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="마이페이지"
        component={MypageStackNavigator}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
