import React, {useEffect} from 'react';
import {View, Button, Alert} from 'react-native';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import {audioBytesList} from './mockAudioData';

// 각 음성 파일을 지정된 이름으로 저장할 경로 설정
const audioPaths = audioBytesList.map(
  (_, index) => `${RNFS.DocumentDirectoryPath}/audio${index + 1}.wav`,
);

const setupAudioFiles = async () => {
  // 각 파일이 존재하는지 확인하고 없으면 생성
  await Promise.all(
    audioBytesList.map(async (audioBytes, index) => {
      const path = audioPaths[index];
      const fileExists = await RNFS.exists(path);
      if (!fileExists) {
        await RNFS.writeFile(path, audioBytes, 'base64');
      }
    }),
  );
};

const PlayAllAudios = () => {
  const playAllAudios = async () => {
    for (let i = 0; i < audioPaths.length; i++) {
      await playAudio(audioPaths[i]);
    }
  };

  const playAudio = audioPath => {
    return new Promise(resolve => {
      const sound = new Sound(audioPath, '', error => {
        if (error) {
          console.error('오디오 파일 로드 오류:', error);
          resolve();
          return;
        }
        sound.play(success => {
          if (success) {
            console.log('성공적으로 재생되었습니다.');
          } else {
            console.error('재생 오류');
          }
          sound.release();
          resolve(); // 다음 파일로 이동
        });
      });
    });
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 한 번만 음성 파일을 설정
    setupAudioFiles()
      .then(() => Alert.alert('오디오 파일 준비 완료'))
      .catch(error => console.error('오디오 파일 설정 오류:', error));
  }, []);

  return (
    <View>
      <Button title="Play All Audios" onPress={playAllAudios} />
    </View>
  );
};

export default PlayAllAudios;
