import React from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Button, ButtonText, Container, ContentContainer, ContentText, GIFContainer, HeaderContainer, HealthType, StyledGIF, TextContainer, TitleText } from './HealthInfo.style';

export default function HealthInfo() {
  const route = useRoute();
  const navigation = useNavigation();
  const { title, difficulty, targetMuscle, mainMuscle, secondaryMuscle, gifSource, exerciseOrder, caution } = route.params;

  useFocusEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });

    return () => navigation.getParent()?.setOptions({
      tabBarStyle: undefined,
    });
  });

  return (
    <Container>
      <ContentContainer >
        <GIFContainer>
          <StyledGIF source={gifSource}/>
        </GIFContainer>
          <TextContainer>
            <TitleText>운동 정보</TitleText>
            <ContentText>난이도: {difficulty}</ContentText>
            <ContentText>운동 부위: {targetMuscle}</ContentText>
            <ContentText>주운동 근육 부위: {mainMuscle}</ContentText>
            <ContentText>부운동 근육 부위: {secondaryMuscle}</ContentText>
          </TextContainer>
          <TextContainer>
            <TitleText>운동 순서</TitleText>
            {exerciseOrder.map((step, index) => (
              <ContentText key={index}>{step}</ContentText>
            ))}
          </TextContainer>
          <TextContainer>
            <TitleText>주의 사항</TitleText>
            {caution.map((cautionItem, index) => (
              <ContentText key={index}>{cautionItem}</ContentText>
            ))}
          </TextContainer>
      </ContentContainer>
      <Button onPress={() => navigation.navigate('HealthNum', { title, gifSource })}>
        <ButtonText>AI와 함께 운동해보세요!</ButtonText>
      </Button>
    </Container>
  );
}
