import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RootStackParamList } from "../navigator.types";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import Home from "../../screens/Home";
import Profile from "../../screens/Profile";
import Search from "../../screens/Search";
import Cook from "../../screens/Cook";
import ProfileNavigator from "../../screens/ProfileNavigator/profile-navigator.screen";
import Notifications from "../../screens/Notifications";
import { RootState } from "../../store/store";
import TabIconWithBadge from "./notificationTabIcon";

const Tab = createBottomTabNavigator<RootStackParamList>();

export const Dashboard = () => {
  const unseenNotifications = useSelector(
    (state: RootState) => state.notificationsCount.unseenNotifications
  );
  const {
    theme: {
      colors: { primary, secondary },
    },
  } = useThemeConsumer();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap | undefined;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Cook") {
            iconName = focused ? "pizza" : "pizza-outline";
          } else if (route.name === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline";
            return (
              <TabIconWithBadge
                name={iconName}
                badgeCount={unseenNotifications}
                color={color}
                size={size}
              />
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: secondary,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Cook" component={Cook} />
      <Tab.Screen name="Notifications" component={Notifications} />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        initialParams={{ refresh: 1 }}
      />
    </Tab.Navigator>
  );
};
