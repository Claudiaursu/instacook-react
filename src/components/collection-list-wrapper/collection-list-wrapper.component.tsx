import { FlatList, RefreshControl, View } from "react-native";
import React, { useEffect, useState } from 'react';
import { CollectionComponent } from "../collection/collection.component";
import { CollectionDto, useGetCollectionsByUserIdQuery } from "../../services/collection.service";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import { CollectionNavStackParamList } from "./collection-list.navigator";
import CollectionInfo from "../../screens/CollectionInfo/collectionInfo.screen";
import CollectionList from "../collection-list/collection-list.component";
import { useNavigation } from "@react-navigation/native";
import { TabViewProfileParamList } from "../tab-view-profile/tab-view-profile.types";

//const Stack = createNativeStackNavigator<CollectionNavStackParamList>();
const Stack = createNativeStackNavigator<CollectionNavStackParamList>();
type CollectionComponentProps = NativeStackScreenProps<CollectionNavStackParamList, "CollectionsList">;
type CollectionListProps = NativeStackScreenProps<TabViewProfileParamList, "Collections">;


const CollectionListWrapper = ({
  navigation,
  route,
}: {
  navigation: CollectionListProps;
  route: any;
}) => {

  const loggedId = useSelector((state: RootState) => state.userData.loggedId);
  const token = useSelector((state: RootState) => state.userData.token);

  // const navigation = useNavigation(); // Get navigation object
  // navigation.setParams({ userId: userId, refresh: refresh });

  const { userId } = route.params;
  const { refresh } = route.params;

  useEffect(() => {}, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen
        name="CollectionsList"
        component={CollectionList}
        initialParams={{ userId: userId, refresh: refresh }}
      /> */}
      <Stack.Screen name="CollectionInfo" component={CollectionInfo} />
      {/* <Stack.Screen name="CollectionsList" component={CollectionList} userId={userId} refresh={refresh} navigation={navigation}/> */}
    </Stack.Navigator>
  );
};

export default CollectionListWrapper;