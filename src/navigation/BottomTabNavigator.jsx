import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import Home from '../screens/Home';
import MyPage from '../screens/Mypage';
import Routine from '../screens/Routine';
import AIpt from '../screens/AIpt';
import HeaderMain from '../components/HeaderMain';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
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
        tabBarStyle: {
          height: 70,
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
        },
        tabBarLabelStyle: {
          marginBottom: 8,
        },
        headerTitle: () => <HeaderMain />,
      })}>
      <Tab.Screen name="홈" component={Home} />
      <Tab.Screen name="AI 피티" component={AIpt} />
      <Tab.Screen name="운동 루틴" component={Routine} />
      <Tab.Screen name="마이페이지" component={MyPage} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
