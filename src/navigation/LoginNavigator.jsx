import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Login';
import BottomTabNavigator from './BottomTabNavigator';
import Signup1 from '../screens/Signup1';
import Signup2 from '../screens/Signup2';
import WelcomePage from '../screens/WelcomePage';

const Stack = createStackNavigator();

function LoginNavigator({isLoggedIn, setIsLoggedIn}) {
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        // 로그인 된 상태에서는 바텀 네비게이터 표시
        // <Stack.Screen
        //   name="Main"
        //   component={BottomTabNavigator}
        //   options={{headerShown: false}}
        // />
        <Stack.Screen name="Main" options={{headerShown: false}}>
          {props => (
            <BottomTabNavigator {...props} setIsLoggedIn={setIsLoggedIn} />
          )}
        </Stack.Screen>
      ) : (
        // 로그인되지 않은 경우 로그인 화면을 표시
        <>
          <Stack.Screen name="Login" options={{headerShown: false}}>
            {props => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
          {/* 회원가입 페이지 추가 */}
          <Stack.Screen
            name="SignUp"
            component={Signup1}
            options={{title: ''}}
          />
          <Stack.Screen
            name="SignUp2"
            component={Signup2}
            options={{title: ''}}
          />
          <Stack.Screen
            name="WelcomePage"
            component={WelcomePage}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default LoginNavigator;
