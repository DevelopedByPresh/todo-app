import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import OnBoardingScreen from './screens/onBoardingScreen';
import TodoListScreen from './screens/TodoListScreen';
import AddTodos from './screens/AddTodos';


import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";











const Stack = createStackNavigator();





export default function App() {
  return (
   <NavigationContainer>

    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
      <Stack.Screen name="TodoListScreen" component={TodoListScreen} />
      <Stack.Screen name="AddTodos" component={AddTodos} />
 
    </Stack.Navigator>
  </NavigationContainer>
  );
}







const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
