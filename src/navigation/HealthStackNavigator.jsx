import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Healthlist from '../screens/Healthlist';
import HealthInfo from '../screens/HealthInfo';
import Health from '../screens/Health';
import HealthResult from '../screens/HealthResult';
import HeaderMain from '../components/HeaderMain';
import exerciseData from '../components/Health/HealthInfoData';
import Loading from '../screens/Loading';

const Stack = createStackNavigator();
const CustomHeader = () => <HeaderMain />;

export default function HealthStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Healthlist"
        component={Healthlist}
        options={{headerTitle: CustomHeader}}
      />
      <Stack.Screen
        name="HealthInfo"
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
      <Stack.Screen
        name="Health"
        component={Health}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Loading"
        component={Loading}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HealthResult"
        component={HealthResult}
        options={{
          headerShown: true,
          title: '솔루션',
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      />
    </Stack.Navigator>
  );
}
