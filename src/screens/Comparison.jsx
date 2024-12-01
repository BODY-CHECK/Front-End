import React, {useState, useEffect} from 'react';
import {
  useRoute,
} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import Video from 'react-native-video';
import { Container, ContentContainer, ContentText, GIFContainer } from './Comparison.style';
import { getExpertById } from '../api/SolutionApi';

export default function Comparison() {
  const route = useRoute();
  const { exerciseId, videoUrl } = route.params;
  const [isExpert, setExpert] = useState(false);
  const [Error, setError] = useState(null);

  console.log(exerciseId);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const response = await getExpertById(exerciseId);
        console.log('운동전문가?: ', response.result);
        setExpert(response.result);
      } catch (err) {
        console.error('Error during API calling:', err);
        setError('데이터를 불러오는 데 실패했습니다.');
      }
    };

    fetchExpert();
  }, [exerciseId]);

  return (
    <Container>
      <ContentContainer>
        <GIFContainer>
          {videoUrl ? (
            <Video
              source={{uri: videoUrl}} // 비디오 파일의 URL 또는 로컬 파일 경로
              style={styles.video}
              controls={true} // 기본 컨트롤러 표시 (재생, 일시정지, 탐색바 등)
              resizeMode="contain" // 비디오 크기 조절 방식 ('cover', 'contain', 'stretch' 등)
              paused={true} // true일 경우 비디오가 일시정지됨
              repeat={false} // 비디오 반복 재생
            />
          ) : (
            <ContentText>나의 운동 자세를 전문가와 비교해보세요!</ContentText>
          )}
        </GIFContainer>
        <GIFContainer>
            <Video
              source={{uri: `${isExpert.solutionVideoUrl}.mp4`}} // 비디오 파일의 URL 또는 로컬 파일 경로
              style={styles.video}
              controls={true} // 기본 컨트롤러 표시 (재생, 일시정지, 탐색바 등)
              resizeMode="contain" // 비디오 크기 조절 방식 ('cover', 'contain', 'stretch' 등)
              paused={true} // true일 경우 비디오가 일시정지됨
              repeat={false} // 비디오 반복 재생
            />
        </GIFContainer>
      </ContentContainer>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: 300, 
  },
});
