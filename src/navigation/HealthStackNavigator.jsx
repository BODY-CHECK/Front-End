import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Healthlist from '../screens/Healthlist';
import HealthInfo from '../screens/HealthInfo';

const Stack = createStackNavigator();

export default function HealthStackNavigator(){
    return(
        <Stack.Navigator>
            <Stack.Screen name="Healthlist" component={Healthlist} options={{ headerShown: false }}/>
            <Stack.Screen name="HealthInfo" component={HealthInfo} options={{ headerShown: false }}/>
        </Stack.Navigator>
    );
}
