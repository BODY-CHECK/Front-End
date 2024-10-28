import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {AuthProvider} from './AuthContext';
import LoginNavigator from './navigation/LoginNavigator';

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <LoginNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
