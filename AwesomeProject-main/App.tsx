import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/components/HomeScreen/index';
import DeviceScreen from './src/components/DeviceScreen/index';
import {Chart} from './src/components/chart';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dehumidifiers">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="DeviceScreen" component={DeviceScreen} />
        <Stack.Screen name="Chart" component={Chart} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
