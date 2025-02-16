import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LearningScreen from './src/screens/LearningScreen';
import SessionCompleteScreen from './src/screens/SessionCompleteScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: '单词本'}}
        />
        <Stack.Screen
          name="Learning"
          component={LearningScreen}
          options={{title: '学习'}}
        />
        <Stack.Screen
          name="SessionComplete"
          component={SessionCompleteScreen}
          options={{
            title: '完成',
            headerLeft: () => null, // 禁用返回按钮
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
