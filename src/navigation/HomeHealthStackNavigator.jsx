import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import HeaderMain from '../components/HeaderMain';
import exerciseData from '../components/Health/HealthInfoData';
import HealthInfo from '../screens/HealthInfo';
import Home from '../screens/Home';

const Stack = createStackNavigator();
const CustomHeader = () => <HeaderMain />;

export default function HomeHealthStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerTitle: CustomHeader}}
      />
      <Stack.Screen
        name="HomeHealthInfo"
        component={HealthInfo}
        options={({route}) => {
          const exercise = exerciseData.find(ex => ex.id === route.params?.id);
          return {
            headerShown: true,
            title: exercise?.title || '운동 정보', // title이 없으면 기본값으로 '운동 정보' 설정
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          };
        }}
      />
    </Stack.Navigator>
  );
}
