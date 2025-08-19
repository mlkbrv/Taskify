import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/main/HomeScreen';
import MyTasksScreen from '../screens/main/MyTasksScreen';
import CreatedTasksScreen from '../screens/main/CreatedTasksScreen';
import CompletedTasksScreen from '../screens/main/CompletedTasksScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MyTasks') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'CreatedTasks') {
            iconName = focused ? 'create' : 'create-outline';
          } else if (route.name === 'CompletedTasks') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Главная' }}
      />
      <Tab.Screen 
        name="MyTasks" 
        component={MyTasksScreen}
        options={{ title: 'Мои задачи' }}
      />
      <Tab.Screen 
        name="CreatedTasks" 
        component={CreatedTasksScreen}
        options={{ title: 'Созданные' }}
      />
      <Tab.Screen 
        name="CompletedTasks" 
        component={CompletedTasksScreen}
        options={{ title: 'Завершенные' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Профиль' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
