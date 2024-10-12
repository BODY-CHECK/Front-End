import {View, Text} from 'react-native';
import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Button, ButtonText} from './HealthInfo.style';
import exerciseData from '../components/Health/HealthInfoData';

export default function Health() {
  const route = useRoute();
  const {id} = route.params;
  const exercise = exerciseData.find(ex => ex.id === id);
  const navigation = useNavigation();

  return (
    <View>
      <Text>Health</Text>
      <Button onPress={() => navigation.navigate('HealthResult', {id})}>
        <ButtonText>AI와 함께 운동해보세요!</ButtonText>
      </Button>
    </View>
  );
}
