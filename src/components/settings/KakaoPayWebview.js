import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Modal,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import {WebView} from 'react-native-webview';
import SendIntentAndroid from 'react-native-send-intent';

const KakaoPayWebview = ({url, onClose, onSuccess}) => {
  const handleShouldStartLoadWithRequest = event => {
    const {url: requestUrl} = event;

    if (requestUrl.startsWith('http')) {
      // http URL인 경우 외부 링크 열기
      Linking.openURL(requestUrl);
      return false;
    }

    if (Platform.OS === 'android' && requestUrl.startsWith('intent://')) {
      // Android에서 intent:// 스킴 처리
      const parsedUrl = requestUrl.replace('intent://', 'https://');
      SendIntentAndroid.openAppWithUri(parsedUrl)
        .then(isOpened => {
          if (!isOpened) {
            Alert.alert('앱 실행 실패', '앱을 실행할 수 없습니다.');
          }
        })
        .catch(error => {
          console.error('Intent URL 처리 오류:', error);
          Alert.alert('결제 오류', 'URL 처리 중 오류가 발생했습니다.');
        });
      return false;
    }

    if (requestUrl.includes('pg_token=')) {
      // pg_token이 포함된 URL은 결제 성공 처리
      const pgToken = requestUrl.split('pg_token=')[1];
      onSuccess(pgToken); // 결제 성공 시 pg_token 전달
      onClose(); // WebView 닫기
      return false;
    }

    return true; // 그 외의 URL은 WebView에서 로드 허용
  };

  return (
    <Modal
      visible={!!url}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <WebView
          source={{uri: url}}
          originWhitelist={['http://*', 'https://*', 'intent://*']}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest} // URL 로드 조건 처리
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경으로 설정
  },
});

export default KakaoPayWebview;
