import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/Home';
import Login from '../screens/Login';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

function LoginNavigator({isLoggedIn, setIsLoggedIn}) {
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        // 로그인 된 상태에서는 바텀 네비게이터 표시
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />
      ) : (
        // 로그인되지 않은 경우 로그인 화면을 표시
        <Stack.Screen name="Login" options={{headerShown: false}}>
          {props => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

export default LoginNavigator;
