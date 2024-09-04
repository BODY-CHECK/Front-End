import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import MyPage from '../pages/Mypage';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="MyPage" component={MyPage} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
