import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Home from "../../screens/Home";
// import Settings from "../../screens/Settings";
import Ionicons from "@expo/vector-icons/Ionicons";

import { RootStackParamList } from "../navigator.types";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import Home from "../../screens/Home";
import Profile from "../../screens/Profile";

const Tab = createBottomTabNavigator<RootStackParamList>();

export const Dashboard = () => {
  const {
    theme: {
      colors: { primary, secondary },
    },
  } = useThemeConsumer();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: secondary,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};