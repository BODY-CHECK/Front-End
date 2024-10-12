import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Healthlist from '../screens/Healthlist';
import HealthInfo from '../screens/HealthInfo';
import HealthNum from '../screens/HealthNum';
import Health from '../screens/Health';
import HealthResult from '../screens/HealthResult';
import HeaderMain from '../components/HeaderMain';

const Stack = createStackNavigator();
const CustomHeader = () => <HeaderMain />;

export default function HealthStackNavigator(){
    return(
        <Stack.Navigator >
            <Stack.Screen name="Healthlist" component={Healthlist} options={{ headerTitle: CustomHeader }}/>
            <Stack.Screen name="HealthInfo" component={HealthInfo} options={({ route }) => ({
    headerShown: true,
    title: route.params?.title,
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  })}/>
            <Stack.Screen name="HealthNum" component={HealthNum} options={{ headerShown: false }}/>
            <Stack.Screen name="Health" component={Health} options={{ headerShown: false }}/>
            <Stack.Screen name="HealthResult" component={HealthResult} options={{ headerShown: true, title: '솔루션', headerTitleAlign: 'center' , headerTitleStyle: {fontWeight: 'bold'} }}/>
        </Stack.Navigator>
    );
}
