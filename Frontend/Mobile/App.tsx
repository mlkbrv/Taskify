import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { TaskProvider } from './src/contexts/TaskContext';
import RootNavigator from './src/navigation/RootNavigator';

function AppContent() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <TaskProvider>
          <AppContent />
          <StatusBar style="auto" />
        </TaskProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
