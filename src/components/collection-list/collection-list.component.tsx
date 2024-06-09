import { FlatList, RefreshControl, View } from "react-native";
import React, { useEffect, useState, useCallback } from 'react';
import { CollectionComponent } from "../collection/collection.component";
import { CollectionDto, useGetCollectionsByUserIdQuery, useGetPublicCollectionsByUserIdQuery } from "../../services/collection.service";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const CollectionList = ({ userId, refresh }: { userId: number, refresh: number }) => {
    const loggedId = useSelector((state: RootState) => state.userData.loggedId);
    const token = useSelector((state: RootState) => state.userData.token);

    const renderItem = ({ item }: { item: CollectionDto }) => {
        let isOwner = false;
        if (loggedId === userId) {
            isOwner = true;
        }
        return <CollectionComponent collection={item} isOwner={isOwner} handleDeleteUpdates={handleDeleteUpdates} />
    };

    const collectionParams = {
        id: userId,
        token: token
    };

    const { data, refetch, isLoading } = loggedId === userId
        ? useGetCollectionsByUserIdQuery(collectionParams, {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            refetchOnReconnect: true
        })
        : useGetPublicCollectionsByUserIdQuery(collectionParams, {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            refetchOnReconnect: true
        });

    const [collectionDataList, setCollectionDataList] = useState<CollectionDto[]>(data ? data : []);

    const [refreshing, setRefreshing] = useState(false);

    const handleDeleteUpdates = (collectionId: any) => {
        console.log(collectionId + " " + typeof collectionId)
        const newCollectionList = collectionDataList.filter(col => col.id != collectionId);
        setCollectionDataList(newCollectionList);
    }

    useEffect(() => {
        if (data && data.length > 0) {
            setCollectionDataList(data);
        }
    }, [data, refresh]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refetch().then(() => setRefreshing(false));
    }, []);

    return (
        <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 10 }}>
            <FlatList
                data={collectionDataList as CollectionDto[] | undefined}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
};

export default CollectionList;
