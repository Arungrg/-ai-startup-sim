import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import SettingsScreen from "./src/screens/game/SettingsScreen";
import { COLORS } from "./src/constants/theme";

import WinScreen from "./src/screens/game/WinScreen";
import FailScreen from "./src/screens/game/FailScreen";
import DashboardScreen from "./src/screens/tabs/DashboardScreen";
import ProductsScreen from "./src/screens/tabs/ProductsScreen";
import TeamScreen from "./src/screens/tabs/TeamScreen";
import MarketScreen from "./src/screens/tabs/MarketScreen";
import MenuScreen from "./src/screens/game/MenuScreen";
import CreateScreen from "./src/screens/game/CreateScreen";
import FundingScreen from "./src/screens/game/FundingScreen";
import { useEffect } from "react";
import { preloadSounds } from "./src/constants/sounds";

import { useFonts } from "expo-font";
import {
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import { Inter_400Regular, Inter_500Medium } from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function GameTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
        },
        tabBarActiveTintColor: COLORS.purple,
        tabBarInactiveTintColor: COLORS.muted,
        headerShown: false,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Team" component={TeamScreen} />
      <Tab.Screen name="Market" component={MarketScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    "SpaceGrotesk-Medium": SpaceGrotesk_500Medium,
    "SpaceGrotesk-Bold": SpaceGrotesk_700Bold,
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
  });
  useEffect(() => {
    preloadSounds();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Menu"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Win" component={WinScreen} />
        <Stack.Screen name="Fail" component={FailScreen} />
        <Stack.Screen name="Funding" component={FundingScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Create" component={CreateScreen} />
        <Stack.Screen name="Game" component={GameTabs} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
