// SettingsStackNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HeaderMain from '../components/HeaderMain';
import MyPage from '../screens/Mypage';
import SettingsScreen from '../screens/SettingScreen';
import ProfileEdit from '../screens/ProfileEdit';
import PasswordChange from '../screens/PasswordChange';
import PremiumUpgrade from '../screens/PremiumUpgrade';
import ResultList from '../screens/ResultList';
import Solution from '../screens/Solution';
import IsPremium from '../screens/IsPremium';
import SubscriptionHandler from './SubscriptionHandler';

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
        options={{
          headerShown: true,
          title: 'My 솔루션',
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      />
      <Stack.Screen
        name="Solution"
        component={Solution}
        options={{
          headerShown: true,
          title: 'My 솔루션',
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold'},
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
        options={{title: '비밀번호 수정', headerTitleAlign: 'center'}}
      />

      <Stack.Screen
        name="PremiumUpgrade"
        component={PremiumUpgrade}
        options={{title: '프리미엄 구독', headerTitleAlign: 'center'}}
      />
      <Stack.Screen
        name="IsPremium"
        component={IsPremium}
        options={{title: '프리미엄 구독', headerTitleAlign: 'center'}}
      />
      <Stack.Screen
        name="SubscriptionHandler"
        component={SubscriptionHandler}
        options={{headerShown: false}} // 로딩 화면을 보여주므로 헤더 비활성화
      />
    </Stack.Navigator>
  );
}

export default MypageStackNavigator;
