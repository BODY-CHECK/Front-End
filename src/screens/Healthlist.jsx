import React from 'react';
import {Container, HealthContainer, HealthType, HealthList, HealthIcon, IconName, StyledImage} from './Healthlist.style';
import { useNavigation } from '@react-navigation/native';


export default function Healthlist({navigation}) {
  return (
    <Container>
        <HealthContainer>
            <HealthType>상체 운동</HealthType>
            <HealthList>
                <HealthIcon onPress={() => {navigation.navigate('HealthInfo')}}>
                    <StyledImage source={require('../assets/images/Health/push-up.png' )} />
                    <IconName>푸쉬업</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => navigation.navigate('HealthInfo')}>
                    <StyledImage source={require('../assets/images/Health/kneeing-push-up.png' )}/>
                    <IconName>푸쉬업(무릎)</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => {navigation.navigate('HealthInfo')}}>
                    <StyledImage source={require('../assets/images/Health/pull-up.png' )}/>
                    <IconName>풀업</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => {navigation.navigate('HealthInfo')}}>
                    <StyledImage source={require('../assets/images/Health/banding-pull-up.png' )}/>
                    <IconName>풀업(밴드)</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => {navigation.navigate('HealthInfo')}}>
                    <StyledImage source={require('../assets/images/Health/sit-ups.png' )}/>
                    <IconName>윗몸일으키기</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => {navigation.navigate('HealthInfo')}}>
                    <StyledImage source={require('../assets/images/Health/leg-raise.png' )}/>
                    <IconName>레그레이즈</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => {navigation.navigate('HealthInfo')}}>
                    <StyledImage source={require('../assets/images/Health/hanging-leg-raise.png' )}/>
                    <IconName>레그레이즈(행잉)</IconName>
                </HealthIcon>
            </HealthList>
            <HealthType>하체 운동</HealthType>
            <HealthList>
                <HealthIcon onPress={() => {navigation.navigate('HealthInfo')}}>
                    <StyledImage source={require('../assets/images/Health/squat.png' )}/>
                    <IconName>스쿼트</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => {navigation.navigate('HealthInfo')}}>
                    <StyledImage source={require('../assets/images/Health/one-leg-squat.png' )}/>
                    <IconName>한 발 스쿼트</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => {navigation.navigate('HealthInfo')}}>
                    <StyledImage source={require('../assets/images/Health/lunge.png' )}/>
                    <IconName>런지</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => {navigation.navigate('HealthInfo')}}>
                    <StyledImage source={require('../assets/images/Health/cap-phrase.png' )}/>
                    <IconName>카프레이즈</IconName>
                </HealthIcon>
                <HealthIcon onPress={() => {navigation.navigate('HealthInfo')}}>
                    <StyledImage source={require('../assets/images/Health/hip-thrust.png' )}/>
                    <IconName>힙 쓰러스트</IconName>
                </HealthIcon>
            </HealthList>
        </HealthContainer>
    </Container>
  );
}
