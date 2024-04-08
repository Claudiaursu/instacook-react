import { FlatList, RefreshControl, View } from "react-native";
import React from 'react';
import { CollectionComponent } from "../collection/collection.component";
import { CollectionDto, useGetCollectionsByUserIdQuery } from "../../services/collection.service";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { ICollection } from "../../interfaces/collection";

const CollectionList = () => {
  const renderItem = ({ item }: { item: CollectionDto }) => (
    <CollectionComponent collection={item} />
  );

  const loggedId = useSelector((state: RootState) => state.userData.loggedId);
  const token = useSelector((state: RootState) => state.userData.token); 
  
  const collectionParams = {
    id: loggedId,
    token: token
  }
  const { data, error, isLoading } = useGetCollectionsByUserIdQuery(collectionParams);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
      <FlatList
        data={data as CollectionDto[] | undefined} // Type assertion here
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
        // }
      />
    </View>
  );
};

export default CollectionList;