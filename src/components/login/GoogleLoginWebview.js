// GoogleLoginWebview.js
import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {useNavigation, useRoute} from '@react-navigation/native';
import CookieManager from '@react-native-cookies/cookies';

const GoogleLoginWebview = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const googleAuthUrl = route.params.googleUrl;

  useEffect(() => {
    // WebView 로드 전 쿠키 삭제
    const clearCookies = async () => {
      try {
        await CookieManager.clearAll(); // 모든 쿠키 삭제
        console.log('Cookies cleared');
      } catch (error) {
        console.error('Failed to clear cookies:', error);
      }
    };

    clearCookies(); // 쿠키 삭제 함수 호출
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        style={styles.webview}
        source={{uri: googleAuthUrl}}
        onNavigationStateChange={event => {
          if (event.url.includes('code=')) {
            const code = event.url.split('code=')[1];
            navigation.navigate('GoogleLoginRedirect', {token: code});
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default GoogleLoginWebview;
