import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SearchComponent } from '../search/search.component';
import Home from '../../screens/Home';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { useThemeConsumer } from '../../utils/theme/theme.consumer';
import CollectionList from '../collection-list/collection-list.component';

const Tab = createMaterialTopTabNavigator();

export const TabViewProfile = () => {
  const insets = useSafeAreaInsets();


  const {
    theme,
    activeScheme,
    toggleThemeSchema
  } = useThemeConsumer();
  

  return (
    <View style={{ flex: 1 }} >

      <Tab.Navigator
      tabBarPosition="top"
      tabBarOptions={{
        style: { backgroundColor: theme.colors.background2 }, // Set background color here
        indicatorStyle: { backgroundColor: theme.colors.primary }, // Optional: Customize tab indicator color
        activeTintColor: theme.colors.primary, // Optional: Text color for active tab
        inactiveTintColor: theme.colors.text, // Optional: Text color for inactive tabs
      }}
      >
      <Tab.Screen name="Collections" component={CollectionList} />
      <Tab.Screen name="Recipes" component={SearchComponent} />
      </Tab.Navigator>

      </View>
    
  );
}