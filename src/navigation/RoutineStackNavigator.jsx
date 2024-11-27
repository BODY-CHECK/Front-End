import {createStackNavigator} from '@react-navigation/stack';
import Routine from '../screens/Routine';
import PremiumUpgrade from '../screens/PremiumUpgrade';
import HeaderMain from '../components/HeaderMain';
import SubscriptionHandler from './SubscriptionHandler';
import IsPremium from '../screens/IsPremium';

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
        name="PremiumUpgrade"
        component={PremiumUpgrade}
        options={{title: '프리미엄 구독', headerTitleAlign: 'center'}}
      />
      <Stack.Screen
        name="IsPremium"
        component={IsPremium}
        options={{title: '프리미엄 구독', headerTitleAlign: 'center'}}
      />
      <Stack.Screen
        name="RoutineSubscriptionHandler"
        component={SubscriptionHandler}
        options={{headerShown: false}} // 로딩 화면을 보여주므로 헤더 비활성화
      />
    </Stack.Navigator>
  );
}

export default RoutineStackNavigator;
