import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SearchComponent } from '../search/search.component';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { useThemeConsumer } from '../../utils/theme/theme.consumer';
import CollectionList from '../collection-list/collection-list.component';
import RecipeList from '../recipe-list/recipe-list.component';
import { TabViewProfileParamList } from './tab-view-profile.types';
import { useNavigation } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator<TabViewProfileParamList>();

export const TabViewProfile = ({ userId, refresh }: {userId: number, refresh: number}) => {
  const insets = useSafeAreaInsets();

  const { theme } = useThemeConsumer();

  

  console.log("refresh in tabview primit: ", refresh)

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
          children={()=><CollectionList userId={userId} refresh={refresh}/>}

          //component={CollectionList} // Directly pass the component reference
          //component={() => <CollectionList userId={userId} refresh={refresh} />} // Use a function to pass updated props
        />
        <Tab.Screen
          name="Recipes"
          component={RecipeList} // Directly pass the component reference
          initialParams={{ userId }}
        />
      </Tab.Navigator>
    </View>
  );
};
