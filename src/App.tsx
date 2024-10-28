import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import LoginNavigator from './navigation/LoginNavigator';
import {AuthProvider} from './AuthContext';

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
