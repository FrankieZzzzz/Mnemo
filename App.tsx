import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TouchableOpacity, Text} from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import LearningScreen from './src/screens/LearningScreen';
import SessionCompleteScreen from './src/screens/SessionCompleteScreen';
import {COLORS} from './src/constants/colors';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: '单词本',
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="Learning"
          component={LearningScreen}
          options={({navigation}) => ({
            title: '学习',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
                style={{marginLeft: 10}}>
                <Text style={{color: COLORS.background}}>单词本</Text>
              </TouchableOpacity>
            ),
            gestureEnabled: false,
          })}
        />
        <Stack.Screen
          name="SessionComplete"
          component={SessionCompleteScreen}
          options={{
            title: '完成',
            headerLeft: () => null,
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
