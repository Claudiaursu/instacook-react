// import * as React from 'react';
// import { View, useWindowDimensions } from 'react-native';
// import { TabView, SceneMap } from 'react-native-tab-view';

// const FirstRoute = () => (
//   <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
// );

// const SecondRoute = () => (
//   <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
// );

// const renderScene = SceneMap({
//   first: FirstRoute,
//   second: SecondRoute,
// });

// export const TabViewProfile = () => {
//   const layout = useWindowDimensions();

//   const [index, setIndex] = React.useState(0);
//   const [routes] = React.useState([
//     { key: 'first', title: 'First' },
//     { key: 'second', title: 'Second' },
//   ]);

//   return (
//     <TabView
//       navigationState={{ index, routes }}
//       renderScene={renderScene}
//       onIndexChange={setIndex}
//       initialLayout={{ width: layout.width }}
//     />
//   );
// }

import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SearchComponent } from '../search/search.component';
import Home from '../../screens/Home';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

export const TabViewProfile = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
    
      // tabBarOptions = {{
      //   style: {
      //     backgroundColor: "white", marginsTop: insets.top
      //   }
      // }} 
      tabBarPosition="top">

      <Tab.Screen name="Home" component={SearchComponent} />
      <Tab.Screen name="Settings" component={SearchComponent} />
    </Tab.Navigator>
  );
}