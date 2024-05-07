import { FlatList, RefreshControl, View } from "react-native";
import React, { useEffect, useState } from 'react';
import { CollectionComponent } from "../collection/collection.component";
import { CollectionDto, useGetCollectionsByUserIdQuery } from "../../services/collection.service";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { ICollection } from "../../interfaces/collection";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TabViewProfileParamList } from "../tab-view-profile/tab-view-profile.types";
import { useFocusEffect } from "@react-navigation/native";


const CollectionList = ({userId, refresh}: {userId:number, refresh:number}) => {
  const loggedId = useSelector((state: RootState) => state.userData.loggedId);
  const token = useSelector((state: RootState) => state.userData.token); 
  
  // const { userId } = route.params;
  // const { refresh } = route.params;

  const renderItem = ({ item }: { item: CollectionDto }) => {
    let isOwner = false;
    if (loggedId === userId) {
      isOwner = true;
    }  
    return <CollectionComponent collection={item} isOwner={isOwner} handleDeleteUpdates={handleDeleteUpdates}/>
  };


  const collectionParams = {
    id: userId,
    token: token
  }
  const { data, error, isLoading, refetch } = useGetCollectionsByUserIdQuery(collectionParams, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  const [collectionDataList, setCollectionDataList] = useState<CollectionDto[]>(data ? data : []); 

  const [refreshing, setRefreshing] = React.useState(refresh);

  const handleDeleteUpdates = (collectionId: any) => {
    console.log(collectionId + " " + typeof collectionId)
    const newCollectionList = collectionDataList.filter(col => col.id != collectionId);
    setCollectionDataList(newCollectionList);
  }

  useEffect(() => {
    if (data && data.length > 0 ) {
      setCollectionDataList(data);
    }
    refetch()
  }, [data, refresh]);


  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
      <FlatList
        data={collectionDataList as CollectionDto[] | undefined} // Type assertion here
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default CollectionList;