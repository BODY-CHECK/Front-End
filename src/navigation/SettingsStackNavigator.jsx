// SettingsStackNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HeaderMain from '../components/HeaderMain';
import MyPage from '../screens/Mypage';
import SettingsScreen from '../screens/SettingScreen';
import ProfileEdit from '../screens/ProfileEdit';
import PasswordChange from '../screens/PasswordChange';

const Stack = createStackNavigator();
const CustomHeader = () => <HeaderMain />;

function MypageStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Mypage"
        component={MyPage}
        options={{headerTitle: CustomHeader}}
      />
      <Stack.Screen
        name="SettingScreen"
        component={SettingsScreen}
        options={{
          title: '설정',
          headerTitleAlign: 'center', // 제목을 가운데 정렬
        }}
      />

      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{title: '프로필 수정', headerTitleAlign: 'center'}}
      />

      <Stack.Screen
        name="PasswordChange"
        component={PasswordChange}
        options={{title: '비밀번호 변경', headerTitleAlign: 'center'}}
      />
      {/*
      <Stack.Screen
        name="AccountManagement"
        component={AccountManagementScreen}
        options={{title: '환불 계좌 관리'}}
      />
      <Stack.Screen
        name="PremiumUpgrade"
        component={PremiumUpgradeScreen}
        options={{title: '프리미엄 업그레이드'}}
      /> */}
    </Stack.Navigator>
  );
}

export default MypageStackNavigator;
