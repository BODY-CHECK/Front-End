// SettingsStackNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
// import ProfileEditScreen from '../screens/ProfileEditScreen';
// import PasswordChangeScreen from '../screens/PasswordChangeScreen';
// import AccountManagementScreen from '../screens/AccountManagementScreen';
// import PremiumUpgradeScreen from '../screens/PremiumUpgradeScreen';
import HeaderMain from '../components/HeaderMain';
import MyPage from '../screens/Mypage';
import SettingsScreen from '../screens/SettingScreen';
import ResultList from '../screens/ResultList';
import Solution from '../screens/Solution';

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
        name="ResultList"
        component={ResultList}
        options={{headerShown: true,
          title: 'My 솔루션',
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold'}}}
      />
      <Stack.Screen
        name="Solution"
        component={Solution}
        options={{headerShown: true,
          title: 'My 솔루션',
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold'}}}
      />
      {/*
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{title: '프로필 수정'}}
      />
      <Stack.Screen
        name="PasswordChange"
        component={PasswordChangeScreen}
        options={{title: '비밀번호 변경'}}
      />
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
