import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LearningScreen from '../screens/LearningScreen';
import {COLORS} from '../constants/colors';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
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
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  /* 处理显示键盘逻辑 */
                }}
                style={{marginRight: 16}}>
                <Text style={{color: COLORS.text}}>显示键盘</Text>
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
