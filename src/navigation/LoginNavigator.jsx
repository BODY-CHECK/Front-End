// LoginNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Login';
import BottomTabNavigator from './BottomTabNavigator';
import Signup1 from '../screens/Signup1';
import Signup2 from '../screens/Signup2';
import WelcomePage from '../screens/WelcomePage';
import {useAuth} from '../AuthContext';
import KakaoLoginWebview from '../components/login/KakaoLoginWebview';
import KakaoLoginRedirect from '../components/login/KakaoLoginRedirect';
import SignupSocial from '../screens/SignupSocial';
import GoogleLoginWebview from '../components/login/GoogleLoginWebview';
import GoogleLoginRedirect from '../components/login/GoogleLoginRedirect';
import Agreement from '../screens/Agreement';
import ResetPassword from '../screens/ResetPassword';

const Stack = createStackNavigator();

function LoginNavigator() {
  const {isLoggedIn, setIsLoggedIn} = useAuth();

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <Stack.Screen name="Main" options={{headerShown: false}}>
          {props => (
            <BottomTabNavigator {...props} setIsLoggedIn={setIsLoggedIn} />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Login" options={{headerShown: false}}>
            {props => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
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
          <Stack.Screen
            name="KakaoLoginWebview"
            component={KakaoLoginWebview}
          />
          <Stack.Screen
            name="KakaoLoginRedirect"
            component={KakaoLoginRedirect}
            options={{title: '로그인 처리 중'}}
          />
          <Stack.Screen
            name="GoogleLoginWebview"
            component={GoogleLoginWebview}
          />
          <Stack.Screen
            name="GoogleLoginRedirect"
            component={GoogleLoginRedirect}
          />

          <Stack.Screen
            name="SignupSocial"
            component={SignupSocial}
            options={{title: ''}}
          />
          <Stack.Screen
            name="Agreement"
            component={Agreement}
            options={{title: ''}}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{title: '비밀번호 재설정'}}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default LoginNavigator;
