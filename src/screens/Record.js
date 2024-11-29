import RecordScreen from 'react-native-record-screen';

// 녹화 시작 함수
export const startRecording = async () => {
    try {
      const response = await RecordScreen.startRecording({
        fps: 60,
        bitrate: 8000000,
        mic: true,
      });

      if (response === 'started') {
        console.log('녹화가 시작되었습니다.');
      } else if (response === 'permission_error') {
        console.warn('녹화 권한이 거부되었습니다.');
      }
    } catch (error) {
      console.error('녹화 시작 오류:', error);
    }
  };

export const stopRecording = async (setIsURL, setIsRecording) => {
  try {
    console.log('녹화 종료 시도 중...');
    const response = await RecordScreen.stopRecording();

    if (response.status === 'success') {
      const url = response.result.outputURL;
      console.log('녹화된 파일 경로:', url);
      setIsURL(url);
    } else if (response.status === 'error') {
      console.error('녹화 중 오류 발생:', response.result);
    }

    setIsRecording(false);
  } catch (error) {
    console.error('녹화 종료 오류:', error);
  }
};
