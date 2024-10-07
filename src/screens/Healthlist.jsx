import React from 'react';
import {Container, HealthContainer, HealthType, HealthList, HealthIcon, IconName, StyledImage} from './Healthlist.style';
import exerciseData from '../components/Health/HealthInfoData';


export default function Healthlist({navigation}) {

  // 특정 운동 ID로 해당 운동 데이터를 찾는 함수
  const handleNavigate = (exerciseId) => {
    const exercise = exerciseData.find(ex => ex.id === exerciseId);
    if (exercise) {
      navigation.navigate('HealthInfo', exercise);  // 데이터를 HealthInfo 화면으로 전달
    }
  };

  return (
    <Container>
        <HealthContainer>
            <HealthType>상체 운동</HealthType>
            <HealthList>
                <HealthIcon onPress={() => handleNavigate('push-up')}>
                    <StyledImage source={require('../assets/images/Health/push-up.png' )} />
                    <IconName>푸쉬업</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => handleNavigate('knee-push-up')}>
                    <StyledImage source={require('../assets/images/Health/kneeing-push-up.png' )}/>
                    <IconName>푸쉬업(무릎)</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => handleNavigate('pull-up')}>
                    <StyledImage source={require('../assets/images/Health/pull-up.png' )}/>
                    <IconName>풀업</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => handleNavigate('band-pull-up')}>
                    <StyledImage source={require('../assets/images/Health/banding-pull-up.png' )}/>
                    <IconName>풀업(밴드)</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => handleNavigate('sit-ups')}>
                    <StyledImage source={require('../assets/images/Health/sit-ups.png' )}/>
                    <IconName>윗몸일으키기</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => handleNavigate('leg-raise')}>
                    <StyledImage source={require('../assets/images/Health/leg-raise.png' )}/>
                    <IconName>레그레이즈</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => handleNavigate('hanging-leg-raise')}>
                    <StyledImage source={require('../assets/images/Health/hanging-leg-raise.png' )}/>
                    <IconName>레그레이즈(행잉)</IconName>
                </HealthIcon>
            </HealthList>
            <HealthType>하체 운동</HealthType>
            <HealthList>
                <HealthIcon onPress={() => handleNavigate('squat')}>
                    <StyledImage source={require('../assets/images/Health/squat.png' )}/>
                    <IconName>스쿼트</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => handleNavigate('one-leg-squat')}>
                    <StyledImage source={require('../assets/images/Health/one-leg-squat.png' )}/>
                    <IconName>한 발 스쿼트</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => handleNavigate('lunge')}>
                    <StyledImage source={require('../assets/images/Health/lunge.png' )}/>
                    <IconName>런지</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => handleNavigate('calf-raise')}>
                    <StyledImage source={require('../assets/images/Health/calf-raise.png' )}/>
                    <IconName>카프레이즈</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => handleNavigate('hip-thrust')}>
                    <StyledImage source={require('../assets/images/Health/hip-thrust.png' )}/>
                    <IconName>힙 쓰러스트</IconName>
                </HealthIcon>
            </HealthList>
        </HealthContainer>
    </Container>
  );
}
