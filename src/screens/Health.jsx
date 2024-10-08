import { View, Text } from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, ButtonText } from './HealthInfo.style';

export default function Health() {
  const route = useRoute();
  const { title, gifSource} = route.params;
  const navigation = useNavigation();

  return (
    <View>
      <Text>Health</Text>
      <Button onPress={() => navigation.navigate('HealthResult', {title, gifSource})}>
        <ButtonText>AI와 함께 운동해보세요!</ButtonText>
      </Button>
    </View>
  );
}
