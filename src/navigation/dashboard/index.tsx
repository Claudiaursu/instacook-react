import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RootStackParamList } from "../navigator.types";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import Home from "../../screens/Home";
import Profile from "../../screens/Profile";
import Search from "../../screens/Search";
import Cook from "../../screens/Cook";

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
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Cook") {
            iconName = focused ? "pizza" : "pizza-outline";
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: secondary,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Cook" component={Cook} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};