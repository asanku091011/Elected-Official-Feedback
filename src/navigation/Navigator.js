// A tiny navigation stack. React Navigation would work too, but this app only
// needs seven screens and a back button, and this way every line is easy to
// explain.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BackHandler } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import TopicScreen from '../screens/TopicScreen';
import RouteScreen from '../screens/RouteScreen';
import ComposeScreen from '../screens/ComposeScreen';
import PreviewScreen from '../screens/PreviewScreen';
import SentScreen from '../screens/SentScreen';
import OfficesScreen from '../screens/OfficesScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AboutScreen from '../screens/AboutScreen';

const SCREENS = {
  Home: HomeScreen,
  Topic: TopicScreen,
  Route: RouteScreen,
  Compose: ComposeScreen,
  Preview: PreviewScreen,
  Sent: SentScreen,
  Offices: OfficesScreen,
  Dashboard: DashboardScreen,
  About: AboutScreen,
};

const NavContext = createContext(null);

let nextKey = 0;

export default function Navigator() {
  const [stack, setStack] = useState([{ name: 'Home', params: {}, key: nextKey++ }]);

  const push = useCallback((name, params = {}) => {
    setStack((current) => [...current, { name, params, key: nextKey++ }]);
  }, []);

  const replace = useCallback((name, params = {}) => {
    setStack((current) => [...current.slice(0, -1), { name, params, key: nextKey++ }]);
  }, []);

  const pop = useCallback(() => {
    setStack((current) => (current.length > 1 ? current.slice(0, -1) : current));
  }, []);

  const reset = useCallback((name = 'Home', params = {}) => {
    setStack([{ name, params, key: nextKey++ }]);
  }, []);

  const canGoBack = stack.length > 1;

  // Android hardware back button behaves like the on-screen back arrow.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 1) {
        pop();
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [stack.length, pop]);

  const nav = useMemo(
    () => ({ push, pop, replace, reset, canGoBack }),
    [push, pop, replace, reset, canGoBack]
  );

  const current = stack[stack.length - 1];
  const Screen = SCREENS[current.name] || HomeScreen;

  return (
    <NavContext.Provider value={nav}>
      <Screen key={current.key} {...current.params} />
    </NavContext.Provider>
  );
}

export function useNav() {
  const value = useContext(NavContext);
  if (!value) {
    throw new Error('useNav must be used inside Navigator');
  }
  return value;
}
