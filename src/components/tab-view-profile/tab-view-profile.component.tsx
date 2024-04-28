import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SearchComponent } from '../search/search.component';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { useThemeConsumer } from '../../utils/theme/theme.consumer';
import CollectionList from '../collection-list/collection-list.component';
import RecipeList from '../recipe-list/recipe-list.component';

const Tab = createMaterialTopTabNavigator();

export const TabViewProfile = ({ userId }: {userId: number}) => {
  const insets = useSafeAreaInsets();

  const { theme } = useThemeConsumer();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        tabBarPosition="top"
        tabBarOptions={{
          style: { backgroundColor: theme.colors.background2 },
          indicatorStyle: { backgroundColor: theme.colors.primary },
          activeTintColor: theme.colors.primary,
          inactiveTintColor: theme.colors.text,
        }}
      >
        {/* Pass userId as a param to CollectionList */}
        <Tab.Screen
          name="Collections"
          component={() => <CollectionList userId={userId} />} // Pass userId as a prop
        />
        <Tab.Screen
          name="Recipes"
          component={() => <RecipeList userId={userId} />} // Pass userId as a prop
        />
      </Tab.Navigator>
    </View>
  );
};
