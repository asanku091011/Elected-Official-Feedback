import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/context/AppContext';
import Navigator from './src/navigation/Navigator';

// Headers are navy across the app, so the status bar text stays light.
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppProvider>
        <Navigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
