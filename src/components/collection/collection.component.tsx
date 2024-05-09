import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { Text } from '../../components/text';
import { CollectionDto, useDeleteCollectionByIdMutation } from '../../services/collection.service';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../utils/firebase/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useThemeConsumer } from '../../utils/theme/theme.consumer';
import { Button } from '../button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/navigator.types';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

type CollectionProps = NativeStackScreenProps<ProfileStackParamList, "CollectionInfo">;

import * as RootNavigation from '../../navigation/root-navigation';
import { ProfileStackParamList } from '../../screens/ProfileNavigator/navigator.types';

export const CollectionComponent = ({
  collection,
  isOwner,
  handleDeleteUpdates,
  //navigation
}: {
  collection: CollectionDto;
  isOwner: boolean;
  handleDeleteUpdates: any;
  //navigation: CollectionProps;
}) => {

  const navigation = useNavigation();

  const collectionDate = new Date(collection.createdAt);
  const username = useSelector((state: RootState) => state.userData.username);
  const token = useSelector((state: RootState) => state.userData.token);

  const [deleteCollectionById, { isSuccess: deleteCollectionSuccess }] =
    useDeleteCollectionByIdMutation();

  const [imageUrl, setImageUrl] = useState("");

  const { theme, activeScheme, toggleThemeSchema } = useThemeConsumer();

  const handleRedirect = () => {
    navigation.dispatch(CommonActions.navigate({ name: 'CollectionInfo', params: { collectionId: collection.id } }));

    //RootNavigation.navigate('CollectionInfo', { collectionId: collection.id });
  }

  useEffect(() => {
    const getPicture = async () => {
      const path = collection.calePoza;
      
      if (path) {
        const imgRef = ref(storage, path);
        const imgUrl = await getDownloadURL(imgRef);
        setImageUrl(imgUrl);
        console.log("IMAGINE COL ", imgUrl)
      }
    };

    getPicture();
  }, [collection.id, username]);

  const deleteCollection = async () => {
    const collectionDeleteParams = {
      id: collection.id,
      token,
    };
    try {
      await deleteCollectionById(collectionDeleteParams);
      handleDeleteUpdates(collection.id);
    } catch (error) {
      console.log("ERROR ", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleRedirect}>
    <View style={styles(activeScheme).container}>
      <View style={styles(activeScheme).card}>
        <Text variant="subtitle">{collection.titluColectie}</Text>

        <View style={styles(activeScheme).contentContainer}>
          {/* Image */}
          <View style={{ alignItems: "center" }}>
            {imageUrl && (
              <Image
                source={{ uri: imageUrl }}
                style={styles(activeScheme).image}
              />
            )}

            {!imageUrl && (
              <MaterialCommunityIcons
                name="chef-hat"
                size={50}
                color={theme.colors.primary}
              />
            )}

            {/* <Image source={{ uri: imageUrl }} style={styles(activeScheme).image} /> */}
          </View>

          <View style={styles(activeScheme).textContainer}>
            <Text
              variant="technicalText"
              numberOfLines={5}
              sx={{ marginBottom: 5 }}
            >
              {collection.descriereColectie}
            </Text>

            <Text variant="technicalText" sx={{ marginBottom: 5 }}>
              Recipes: {collection.retete.length}
            </Text>

            { !collection.publica && 
              (
                <View>
                  <Text variant="technicalText" sx={{ marginBottom: 5 }}>
                    Private {collection.publica}
                    <MaterialCommunityIcons
                      name="lock"
                      size={16}
                      color={theme.colors.secondary}
                    />
                  </Text>
                </View>
              )}

            <Text variant="technicalText" sx={{ marginBottom: 5 }}>
              Created at: {collectionDate.toLocaleDateString()}
            </Text>
          </View>
        </View>

        {isOwner && (
          <View style={{ flexDirection: "row" }}>
            <View>
              <Button
                sx={{ marginLeft: 5, marginRight: 5 }}
                variant="primary"
                onPress={() => {}}
                title="Edit"
              />
            </View>
            <View>
              {/* <MaterialCommunityIcons name="trash-outline" size={24} color={theme.colors.primary} /> */}
              <Button
                sx={{ marginLeft: 5, marginRight: 5 }}
                variant="primary"
                onPress={deleteCollection}
                title="Delete"
              />
            </View>
          </View>
        )}
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = (activeSchema: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 5,
      marginBottom: 5,
    },
    card: {
      backgroundColor: activeSchema == 'light' ? '#ffe6e6' : '#862d59',
      padding: 10,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: activeSchema == 'light' ? '#ffe6e6' : '#8f246b',
    },
    contentContainer: {
      flexDirection: 'row',
     
    },
    image: {
      borderRadius: 10,
      height: 190,
      width: 190,
      marginVertical: 10,
    },
    textContainer: {
      flex: 1,
      marginLeft: 10,
      marginTop: 10,
    },
    createdAt: {
      marginTop: 5,
      color: activeSchema == 'light' ? '#333' : '#fff',
    },
  });

export default CollectionComponent;
