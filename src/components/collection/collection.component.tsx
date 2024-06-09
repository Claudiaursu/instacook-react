import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity, Modal, Switch } from 'react-native';
import { Text } from '../../components/text';
import { CollectionDto, useDeleteCollectionByIdMutation } from '../../services/collection.service';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../utils/firebase/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useThemeConsumer } from '../../utils/theme/theme.consumer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { TextInput } from "../../components/text-input";
import * as ImagePicker from 'expo-image-picker';

type CollectionProps = NativeStackScreenProps<ProfileStackParamList, "CollectionInfo">;

import { ProfileStackParamList } from '../../screens/ProfileNavigator/navigator.types';
import { Button } from '../button';

export const CollectionComponent = ({
  collection,
  isOwner,
  handleDeleteUpdates,
}: {
  collection: CollectionDto;
  isOwner: boolean;
  handleDeleteUpdates: any;
}) => {
  const navigation = useNavigation();
  const collectionDate = new Date(collection.createdAt);
  const username = useSelector((state: RootState) => state.userData.username);
  const token = useSelector((state: RootState) => state.userData.token);
  const [deleteCollectionById, { isSuccess: deleteCollectionSuccess }] = useDeleteCollectionByIdMutation();
  const [imageUrl, setImageUrl] = useState("");
  const { theme, activeScheme } = useThemeConsumer();

  const [isVisible, setIsVisible] = useState(false);
  const [editTitle, setEditTitle] = useState(collection.titluColectie);
  const [editDescription, setEditDescription] = useState(collection.descriereColectie);
  const [isPrivateCollection, setIsPrivateCollection] = useState(!collection.publica);
  const [selectedCollectionImageUri, setSelectedCollectionImageUri] = useState<string | null>(null);

  const handleRedirect = () => {
    navigation.dispatch(CommonActions.navigate({ name: 'CollectionInfo', params: { collectionId: collection.id } }));
  }

  const addCollectionPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedCollectionImageUri(result.assets[0].uri);
    }
  }

  useEffect(() => {
    const getPicture = async () => {
      const path = collection.calePoza;
      if (path) {
        const imgRef = ref(storage, path);
        const imgUrl = await getDownloadURL(imgRef);
        setImageUrl(imgUrl);
        setSelectedCollectionImageUri(imgUrl);
      }
    };
    getPicture();
  }, [collection.id, username]);

  const deleteCollection = async () => {
    const collectionDeleteParams = { id: collection.id, token };
    try {
      await deleteCollectionById(collectionDeleteParams);
      handleDeleteUpdates(collection.id);
    } catch (error) {
      console.log("ERROR ", error);
    }
  };

  const togglePrivacy = () => {
    setIsPrivateCollection(prev => !prev);
  }

  return (
    <TouchableWithoutFeedback onPress={handleRedirect}>
      <View style={styles(activeScheme).container}>
        <View style={styles(activeScheme).card}>
          <Text variant="subtitle" sx={styles(activeScheme).title}>{collection.titluColectie}</Text>
          <View style={styles(activeScheme).contentContainer}>
            <View style={styles(activeScheme).imageContainer}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles(activeScheme).image} />
              ) : (
                <MaterialCommunityIcons name="chef-hat" size={50} color={theme.colors.primary} />
              )}
            </View>
            <View style={styles(activeScheme).textContainer}>
              <Text variant="technicalText" numberOfLines={5} sx={styles(activeScheme).description}>
                {collection.descriereColectie}
              </Text>
              <Text variant="technicalText" sx={styles(activeScheme).infoText}>
                Recipes: {collection.retete.length}
              </Text>
              {!collection.publica && (
                <View style={styles(activeScheme).privateContainer}>
                  <Text variant="technicalText" sx={styles(activeScheme).infoText}>
                    Private
                  </Text>
                  <MaterialCommunityIcons name="lock" size={16} color={theme.colors.secondary} />
                </View>
              )}
              <Text variant="technicalText" sx={styles(activeScheme).infoText}>
                Created at: {collectionDate.toLocaleDateString()}
              </Text>
              {isOwner && (
                <View style={styles(activeScheme).buttonsContainer}>
                  <TouchableOpacity onPress={() => setIsVisible(true)} style={styles(activeScheme).iconButton}>
                    <MaterialCommunityIcons name="pencil-outline" size={24} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={deleteCollection} style={styles(activeScheme).iconButton}>
                    <MaterialCommunityIcons name="delete-outline" size={24} color={theme.colors.primary} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        <Modal visible={isVisible} animationType="slide" transparent>
          <View style={styles(activeScheme).modalContainer}>
            <View style={styles(activeScheme).modalContentCollection}>
              <View style={{ alignItems: 'center' }}>
                <Text variant="title" sx={{ marginBottom: 15, justifyContent: 'center' }}>
                  Edit your collection
                </Text>
              </View>
              <View style={{ margin: 15 }}>
                <TextInput
                  label="Title"
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    textAlign: 'left', // Align text to the left
                    paddingLeft: 1, // Add left padding for better visual
                    paddingTop: 7,
                    paddingBottom: 20,
                  }}
                  textStyle = {{
                    color: theme.colors.cardTitle,
                    fontSize: 14,
                    fontWeight: "bold"
                  }}
                  value={editTitle}
                  onChangeText={(text) => setEditTitle(text)}
                />
                <TextInput
                  label="Description"
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    textAlign: 'left', // Align text to the left
                    paddingLeft: 1, // Add left padding for better visual
                    paddingTop: 7,
                    paddingBottom: 20,
                  }}
                  textStyle = {{
                    color: theme.colors.cardTitle,
                    fontSize: 14,
                    fontWeight: "bold"
                  }}
                  value={editDescription}
                  onChangeText={(text) => setEditDescription(text)}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text sx={{ marginRight: 8, color: theme.colors.cardTitle, fontSize: 14, fontWeight: "bold" }}>
                    Private
                  </Text>
                  <Switch
                    value={isPrivateCollection}
                    onValueChange={togglePrivacy}
                    thumbColor={isPrivateCollection ? 'pink' : '#f4f3f4'}
                    trackColor={{ false: '#f4f3f4', true: 'lightpink' }}
                  />
                </View>
              </View>

              <View style={{ alignItems: 'center', alignContent: 'center'}}>
                {selectedCollectionImageUri ? (
                  <TouchableOpacity onPress={addCollectionPhoto}>
                    <Image
                      source={{ uri: selectedCollectionImageUri }}
                      style={styles(activeScheme).imagePicker}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={addCollectionPhoto}>
                    <MaterialCommunityIcons
                      name="image-outline"
                      size={50}
                      color={theme.colors.primary}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <View style={{ marginTop: 10, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Button sx={{ margin: 10 }} variant="primary" onPress={() => setIsVisible(false)} title="Close" />
                  <Button sx={{ margin: 10 }} variant="primary" onPress={() => { /* Add update functionality */ }} title="Submit" />
                </View>
              </View>
            </View>
          </View>
        </Modal>
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
      backgroundColor: activeSchema === 'light' ? '#ffe6e6' : '#862d59',
      padding: 10,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: activeSchema === 'light' ? '#ffe6e6' : '#8f246b',
    },
    title: {
      marginBottom: 0,
    },
    contentContainer: {
      flexDirection: 'row',
    },
    imageContainer: {
      alignItems: 'center',
      marginRight: 10,
    },
    textContainer: {
      flex: 1,
      marginTop: 10
    },
    description: {
      marginBottom: 5,
    },
    infoText: {
      marginBottom: 5,
    },
    privateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginTop: 10,
    },
    iconButton: {
      marginLeft: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContentRecipe: {
      backgroundColor:"#ffe6e6",
      padding: 30, // Increase padding to make the modal bigger
      borderRadius: 10,
      width: '90%', // Adjust the width as needed
      height: '80%',
      justifyContent: 'center',
      //alignItems: 'center'
    },
    modalContentCollection: {
      backgroundColor:"#ffe6e6",
      padding: 30, // Increase padding to make the modal bigger
      borderRadius: 10,
      width: '90%', // Adjust the width as needed
     // height: '50%',
      justifyContent: 'center',
      //alignItems: 'center'
    },
    imagePicker: {
      borderRadius: 60,
      height: 110,
      width: 110,
      marginBottom: 5,
      //borderRadius: 50, 
    },
    image: {
      borderRadius: 10,
      height: 190,
      width: 190,
      marginVertical: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: '#CCC',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    buttonContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    ingredientPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'pink',
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginHorizontal: 5,
      //padding: 8,
    },
    ingredientsList: {
      //width: '90%',
      flexDirection: 'row',
      marginBottom: 20, 
      
    }
  });

export default CollectionComponent;
