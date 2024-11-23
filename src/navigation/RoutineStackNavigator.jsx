import {createStackNavigator} from '@react-navigation/stack';
import Routine from '../screens/Routine';
import PremiumUpgrade from '../screens/PremiumUpgrade';
import HeaderMain from '../components/HeaderMain';

const Stack = createStackNavigator();
const CustomHeader = () => <HeaderMain />;

function RoutineStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Routine"
        component={Routine}
        options={{headerTitle: CustomHeader}}
      />
      <Stack.Screen
        name="Subscribe"
        component={PremiumUpgrade}
        options={{title: '프리미엄 구독', headerTitleAlign: 'center'}}
      />
    </Stack.Navigator>
  );
}

export default RoutineStackNavigator;
