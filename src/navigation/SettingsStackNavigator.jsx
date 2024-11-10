// SettingsStackNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HeaderMain from '../components/HeaderMain';
import MyPage from '../screens/Mypage';
import SettingsScreen from '../screens/SettingScreen';
import ProfileEdit from '../screens/ProfileEdit';
import PasswordChange from '../screens/PasswordChange';
import PremiumUpgrade from '../screens/PremiumUpgrade';

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

      <Stack.Screen
        name="PremiumUpgrade"
        component={PremiumUpgrade}
        options={{title: '프리미엄 업그레이드', headerTitleAlign: 'center'}}
      />
    </Stack.Navigator>
  );
}

export default MypageStackNavigator;
