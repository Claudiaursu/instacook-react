import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Switch } from "react-native";
import { RootStackParamList } from "../../navigation/navigator.types";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import { TextInput } from "../../components/text-input";
import { View, Modal } from 'react-native';
import { StyleSheet } from "react-native";
import uuid from 'react-native-uuid';
import { Button } from "../../components/button";
import { Text } from "../../components/text";
import { useDispatch, useSelector } from "react-redux";
import { updateToken } from "../../store/tokenSlice";
import { RootState } from "../../store/store";
import * as ImagePicker from 'expo-image-picker';
import { useAddNewCollectionMutation, useDeleteCollectionByIdMutation, useGetCollectionsByUserIdQuery } from "../../services/collection.service";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { CollectionNavStackParamList } from "../../components/collection-list-wrapper/collection-list.navigator";
import { RecipeDto, useGetRecipesByCollectionIdQuery } from "../../services/recipe.service";
import RecipeCardComponent from "../../components/recipe-card/recipe-card.component";

type CollectionInfoProps = NativeStackScreenProps<CollectionNavStackParamList, "CollectionInfo">;

const CollectionInfo = ({ 
  route,
  navigation,
}: {
  route: any
  navigation: CollectionInfoProps}
) => {

  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.userData.username);
  const loggedId = useSelector((state: RootState) => state.userData.loggedId);
  const token = useSelector((state: RootState) => state.userData.token);

  const { collectionId } = route.params;

  const recipesParams = {
    id: collectionId,
    token: token
  }
  const { data: recipesList, error, isLoading, refetch } = useGetRecipesByCollectionIdQuery(recipesParams);
  console.log("RETETEEEEEEE ", recipesList)

  const {
      theme
  } = useThemeConsumer();  

  const renderItem = ({ item }: { item: RecipeDto }) => {
    return <RecipeCardComponent recipe={item} isOwner={true}/>
  };

    return (
     <View style={styles.container}> 
        <View>
          <FlatList
            data={recipesList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2} // Display two columns
            contentContainerStyle={styles.listContainer}
          />
        </View>
     </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingHorizontal: 5,
    //paddingVertical: 12,
    paddingTop: 12,
  },
  listContainer: {
    justifyContent: 'space-between',
  },
});

export default CollectionInfo;