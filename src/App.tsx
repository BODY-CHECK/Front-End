import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {AuthProvider} from './AuthContext';
import LoginNavigator from './navigation/LoginNavigator';
import {StyleSheet, Text, View} from 'react-native';
import {Image} from 'react-native';
import logo from './assets/images/logo.png';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 2초 후에 로딩 상태를 false로 변경
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  if (isLoading) {
    // 스플래시 화면
    return (
      <View style={styles.splashContainer}>
        <Image source={logo} />
        <Text style={styles.splashText}>BodyCheck</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <LoginNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  splashText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default App;
