import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/Home';
import Login from '../screens/Login';

const Stack = createStackNavigator();

function LoginNavigator({isLoggedIn, setIsLoggedIn}) {
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        // 로그인 된 상태에서는 홈 화면으로 이동
        <Stack.Screen name="Home">
          {props => <Home {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
      ) : (
        // 로그인되지 않은 경우 로그인 화면을 표시
        <Stack.Screen name="Login">
          {props => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

export default LoginNavigator;
