import { ScrollView } from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, ButtonText, Container, ContentContainer, GIFContainer, HeaderContainer, HealthType, ItemContainer, ItemText, NumContainer, NumText, SelectNumText, StyledGIF} from './HealthNum.style';

export default function HealthNum() {
  const route = useRoute();
  const { title, gifSource} = route.params;
  const [repCount, setRepCount] = useState(12); // 운동 개수 저장
  const [contentWidth, setContentWidth] = useState(0);
  const itemWidth = 50;
  const numbers = [...Array(20).keys()].map(i => (i + 1).toString());
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (scrollViewRef.current) {
      const initialScrollPosition = (repCount - 1) * itemWidth;
      scrollViewRef.current.scrollTo({ x: initialScrollPosition, animated: false });
    }
  }, [contentWidth]);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / itemWidth);
    setRepCount(index + 1); // Index starts from 0, so adding 1
  };

  return (
    <Container>
      <HeaderContainer>
        <HealthType>{title}</HealthType>
      </HeaderContainer>
      <ContentContainer onLayout={(e) => setContentWidth(e.nativeEvent.layout.width)}>
        <GIFContainer>
          <StyledGIF source={gifSource}/>
        </GIFContainer>
        <NumContainer>
            <NumText>운동 개수 설정</NumText>
            <ScrollView
              horizontal
              ref={scrollViewRef}
              snapToInterval={itemWidth} // Snaps to the next item
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal:(contentWidth - itemWidth) / 2 }}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {numbers.map((item, index) => (
                <ItemContainer key={index} width={itemWidth} selected={repCount === parseInt(item, 10)}>
                  <ItemText selected={repCount === parseInt(item, 10)}>{item}</ItemText>
                </ItemContainer>
              ))}
            </ScrollView>
            <SelectNumText>
              선택한 개수: {repCount}
            </SelectNumText>
    </NumContainer>
      </ContentContainer>
      <Button onPress={() => navigation.navigate('Health', {title, gifSource})}>
        <ButtonText>운동 하기</ButtonText>
      </Button>
    </Container>
  );
}
