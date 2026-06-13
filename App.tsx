import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "./src/constants/theme";

import WinScreen from "./src/screens/game/WinScreen";
import FailScreen from "./src/screens/game/FailScreen";
import DashboardScreen from "./src/screens/tabs/DashboardScreen";
import ProductsScreen from "./src/screens/tabs/ProductsScreen";
import TeamScreen from "./src/screens/tabs/TeamScreen";
import MarketScreen from "./src/screens/tabs/MarketScreen";
import MenuScreen from "./src/screens/game/MenuScreen";
import CreateScreen from "./src/screens/game/CreateScreen";

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
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Menu"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Win" component={WinScreen} />
        <Stack.Screen name="Fail" component={FailScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Create" component={CreateScreen} />
        <Stack.Screen name="Game" component={GameTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
