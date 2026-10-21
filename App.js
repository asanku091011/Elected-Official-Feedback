import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/context/AppContext';
import Navigator from './src/navigation/Navigator';

// Every screen uses a white header and a light content area, so the status
// bar text stays dark for contrast.
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppProvider>
        <Navigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
