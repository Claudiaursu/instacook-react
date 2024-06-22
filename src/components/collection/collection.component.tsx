import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity, Modal, Switch } from 'react-native';
import { Text } from '../../components/text';
import { CollectionDto, useDeleteCollectionByIdMutation, useEditCollectionMutation } from '../../services/collection.service';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../utils/firebase/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useThemeConsumer } from '../../utils/theme/theme.consumer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { TextInput } from "../../components/text-input";
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import { ImagePickerSuccessResult } from "expo-image-picker";


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
  const loggedId = useSelector((state: RootState) => state.userData.loggedId);

  const [isVisible, setIsVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState(collection.titluColectie);
  const [editDescription, setEditDescription] = useState(collection.descriereColectie);
  const [isPrivateCollection, setIsPrivateCollection] = useState(!collection.publica);
  const [selectedCollectionImageUri, setSelectedCollectionImageUri] = useState<string | null>(null);
  const [selectedNewCollectionImageUri, setSelectedNewCollectionImageUri] = useState<ImagePickerSuccessResult>();

  const [editCollection, {isSuccess: editCollectionSuccess }] = useEditCollectionMutation();

  const [newCollectionObj, setNewCollectionObj] = useState({
    titluColectie: collection.titluColectie,
    descriereColectie: collection.descriereColectie,
    publica: collection.publica,
    calePoza: collection.calePoza
  });

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
      setSelectedNewCollectionImageUri(result);
    }
  }

  const uploadImageAsync = async (uri: string, category: string) => {
    const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
    })
    
    const randomUUID = uuid.v4();
    let imgPath = `${username}/${category}/${randomUUID}.jpg`;
    if (category === 'collections') {
      setNewCollectionObj({
        ...newCollectionObj,
        calePoza: imgPath
      })
    } else {
      setNewCollectionObj({
        ...newCollectionObj,
        calePoza: imgPath
      })
    }
    const fileRef = ref(getStorage(), imgPath);

    try {
      const metadata = {
        contentType: 'image/jpeg'
      };
      
      const result = await uploadBytesResumable(fileRef, blob, metadata);

    } catch (error) {
      console.log("ERROOOOOOOR ", error)
    }

    return imgPath;
  }

  const updateCollection = async function () {
    let newCollection = newCollectionObj;
    if (selectedNewCollectionImageUri) {
      let imgPath = await uploadImageAsync(selectedNewCollectionImageUri.assets[0].uri, "collections");      
      newCollection.calePoza = imgPath;
    }

    const collectionProps = {
      ...newCollection,
    }

    try {

      const collectionCreateParams = {
        collection: collectionProps,
        token,
        id: collection.id
      }
      const response: { data?: { id: string }; error?: any } = await editCollection(collectionCreateParams); // Adjust the type accordingly
    } catch (error) {
      console.log("eoare editare colectie: ", error)
    } 

    setIsVisible(false);
  }

  const closeModal = () => {
    setIsVisible(false);
    setNewCollectionObj({
      titluColectie: collection.titluColectie,
      descriereColectie: collection.descriereColectie,
      publica: collection.publica,
      calePoza: collection.calePoza
    });
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
                  <TouchableOpacity onPress={() => setIsDeleteModalVisible(true)} style={styles(activeScheme).iconButton}>
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
                  <Button sx={{ margin: 10 }} variant="primary" onPress={() => closeModal()} title="Close" />
                  <Button sx={{ margin: 10 }} variant="primary" onPress={() => { updateCollection() }} title="Submit" />
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={isDeleteModalVisible} animationType="slide" transparent>
          <View style={styles(activeScheme).modalContainer}>
            <View style={styles(activeScheme).modalContentCollection}>
              <Text variant="title" sx={{ marginBottom: 15, justifyContent: 'center', fontSize: 18, color: theme.colors.cardTitle }}>
                Are you sure you want to delete collection {collection.titluColectie}?
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Button sx={{ margin: 10 }} variant="primary" onPress={() => setIsDeleteModalVisible(false)} title="No" />
                <Button sx={{ margin: 10 }} variant="primary" onPress={() => { deleteCollection(); setIsDeleteModalVisible(false); }} title="Yes" />
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
      marginTop: 10,
      justifyContent: 'space-between', // Ensure spacing is correct
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
      justifyContent: 'space-between', // Space between buttons
      alignItems: 'center', // Center buttons
      marginTop: 10,
      width: '60%', // Ensure container does not exceed the width of the image
      alignSelf: 'center', // Center container
    },
    iconButton: {
      // Ensure buttons are center-aligned within the container
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContentRecipe: {
      backgroundColor:"#ffe6e6",
      padding: 30, 
      borderRadius: 10,
      width: '90%', 
      height: '80%',
      justifyContent: 'center',
    },
    modalContentCollection: {
      backgroundColor:"#ffe6e6",
      padding: 30, 
      borderRadius: 10,
      width: '90%', 
      justifyContent: 'center',
    },
    imagePicker: {
      borderRadius: 60,
      height: 110,
      width: 110,
      marginBottom: 5,
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
