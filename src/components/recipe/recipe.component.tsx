import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Text } from '../../components/text';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../utils/firebase/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useThemeConsumer } from '../../utils/theme/theme.consumer';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { RecipeDto } from '../../services/types';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useDeleteRecipeByIdMutation, useEditRecipeMutation } from '../../services/recipe.service';
import { Button } from '../button';
import { TextInput } from '../text-input';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuid } from 'uuid';
import DropdownComponent from '../dropdown/dropdown.component';


export const RecipeComponent = ({ recipe, isOwner, handleDeleteUpdates }: { recipe: RecipeDto, isOwner: boolean, handleDeleteUpdates: any }) => {
  const navigation = useNavigation();
  const recipeDate = new Date(recipe.createdAt);
  const username = useSelector((state: RootState) => state.userData.username);
  const token = useSelector((state: RootState) => state.userData.token);

  const [imageUrl, setImageUrl] = useState('');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  
  const [deleteRecipenById, { isSuccess: deleteRecipeSuccess }] = useDeleteRecipeByIdMutation();
  const [editRecipe, { isSuccess: editRecipeSuccess }] = useEditRecipeMutation();

  const [editTitle, setEditTitle] = useState(recipe.titluReteta);
  const [editDificultate, setEditDificultate] = useState(recipe.dificultate);
  const [editIngrediente, setEditIngrediente] = useState<string[]>(recipe.ingrediente || []);
  const [editInstructiuni, setEditInstructiuni] = useState(recipe.instructiuni);
  const [editCalePoza, setEditCalePoza] = useState(recipe.calePoza);
  const [currentIngredient, setCurrentIngredient] = useState('');

  const [selectedRecipeImageUri, setSelectedRecipeImageUri] = useState<any>();

  const [newRecipeObj, setNewRecipeObj] = useState({
    titluReteta: recipe.titluReteta,
    dificultate: recipe.dificultate,
    ingrediente: recipe.ingrediente || [],
    instructiuni: recipe.instructiuni,
    calePoza: recipe.calePoza
  });

  const recipeDificulties = [
    { id: 1, value: "Easy" },
    { id: 2, value: "Intermediate" },
    { id: 3, value: "Hard" },
    { id: 4, value: "Extra hard" }
  ];

  useEffect(() => {
    const getPicture = async () => {
      const path = recipe.calePoza;
      if (path) {
        const imgRef = ref(storage, path);
        const imgUrl = await getDownloadURL(imgRef);
        setImageUrl(imgUrl);
        console.log("IMAGINE RETETA ", imgUrl)
      }
    };

    getPicture();
  }, [recipe.id, username]);

  const { theme, activeScheme } = useThemeConsumer();

  const handleRedirect = () => {
    navigation.dispatch(CommonActions.navigate({ name: 'RecipeInfo', params: { recipeId: recipe.id } }));
  }

  const deleteRecipe = async () => {
    const recipeDeleteParams = { id: recipe.id, token };
    try {
      await deleteRecipenById(recipeDeleteParams);
      handleDeleteUpdates(recipe.id);
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.log("ERROR ", error);
    }
  };

  const updateRecipe = async () => {
    let newRecipe = { ...newRecipeObj };
    if (selectedRecipeImageUri) {
      let imgPath = await uploadImageAsync(selectedRecipeImageUri.uri, "recipes");
      newRecipe.calePoza = imgPath;
    }

    const recipeProps = { ...newRecipe };
    const editRecipeParams = { recipe: recipeProps, token, id: recipe.id };

    try {
      await editRecipe(editRecipeParams);
      handleDeleteUpdates(recipe.id); // Assuming this refreshes the recipe list
      setIsEditModalVisible(false);
    } catch (error) {
      console.log(error);
    }
    closeEditModal();
  }

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setNewRecipeObj({
      titluReteta: recipe.titluReteta,
      dificultate: recipe.dificultate,
      ingrediente: recipe.ingrediente,
      instructiuni: recipe.instructiuni,
      calePoza: recipe.calePoza
    });
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
    
    const randomUUID = uuid();
    let imgPath = `${username}/${category}/${randomUUID}.jpg`;
    const fileRef = ref(storage, imgPath);

    try {
      const metadata = { contentType: 'image/jpeg' };
      //await uploadBytesResumable(fileRef, blob, metadata);
    } catch (error) {
      console.log("ERROR ", error);
    }

    return imgPath;
  }

  const addRecipePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedRecipeImageUri(result);
    }
  }

  const setDificultateRecipe = function (text: string) {
    setNewRecipeObj({
      ...newRecipeObj,
      dificultate: text
    })
    setEditDificultate(text)
  }


  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => handleRedirect()}>
        <View style={{ alignItems: "center", backgroundColor: theme.colors.background2 }}>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
            />
          )}

          {!imageUrl && (
            <MaterialCommunityIcons
              name="chef-hat"
              size={50}
              color={theme.colors.primary}
            />
          )}
        </View>
      </TouchableOpacity>

      <View style={{backgroundColor: theme.colors.background2}}>
        <Text variant="subtitle" sx={styles.title}>{recipe.titluReteta}</Text>
      </View>
      {isOwner && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => setIsEditModalVisible(true)}>
            <MaterialCommunityIcons name="pencil-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsDeleteModalVisible(true)}>
            <MaterialCommunityIcons name="delete-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Modal edit recipe */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent>
        <View style={styles.modalEditContainer}>
          <View style={styles.modalEditContentRecipe}>
            <View style={{ alignItems: 'center', marginTop: 1, marginBottom: 10 }}>
              <Text variant="title" sx={{ marginBottom: 15, justifyContent: 'center' }}>
                Edit your recipe
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
                  paddingBottom: 25,
                }}
                textStyle={{
                  color: theme.colors.cardTitle,
                  fontSize: 14,
                  fontWeight: "bold"
                }}
                value={editTitle}
                onChangeText={(text) => {
                  setEditTitle(text);
                  setNewRecipeObj({ ...newRecipeObj, titluReteta: text });
                }}
              />
              <TextInput
                label="Ingredients"
                placeholder="Enter ingredient ..."
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  textAlign: 'left', // Align text to the left
                  paddingLeft: 1, // Add left padding for better visual
                  paddingTop: 7,
                  paddingBottom: 25,
                }}
                textStyle={{
                  color: theme.colors.cardTitle,
                  fontSize: 14,
                  fontWeight: "bold"
                }}
                value={currentIngredient}
                onChangeText={setCurrentIngredient}
                onSubmitEditing={() => {
                  setEditIngrediente([...editIngrediente, currentIngredient]);
                  setNewRecipeObj({ ...newRecipeObj, ingrediente: [...editIngrediente, currentIngredient] });
                  setCurrentIngredient('');
                }}
              />
              <FlatList
                data={editIngrediente}
                renderItem={({ item }) => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>{item}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        const newIngredients = editIngrediente.filter((ing) => ing !== item);
                        setEditIngrediente(newIngredients);
                        setNewRecipeObj({ ...newRecipeObj, ingrediente: newIngredients });
                      }}
                    >
                      <Ionicons name="close-circle" size={20} color={theme.colors.error} />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              <TextInput
                label="Instructions"
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
                multiline={true}
                numberOfLines={4}
                style={{
                  textAlign: 'left', // Align text to the left
                  paddingLeft: 1, // Add left padding for better visual
                  paddingTop: 7,
                  paddingBottom: 25,
                }}
                textStyle={{
                  color: theme.colors.cardTitle,
                  fontSize: 14,
                  fontWeight: "bold"
                }}
                value={editInstructiuni}
                onChangeText={(text) => {
                  setEditInstructiuni(text);
                  setNewRecipeObj({ ...newRecipeObj, instructiuni: text });
                }}
              />
              <DropdownComponent
                data={recipeDificulties}
                action={setDificultateRecipe}
              />
              {/* <View style={styles.photoContainer}>
                <TouchableOpacity onPress={addRecipePhoto}>
                  <Ionicons name="camera" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                {selectedRecipeImageUri && (
                  <Image source={{ uri: selectedRecipeImageUri.uri }} style={styles.selectedImage} />
                )}
              </View> */}
              <View style={{ marginTop: 15, marginBottom: 15 }}>
                <Button
                  title="Save Recipe"
                  onPress={updateRecipe}
                  variant="primary"
                  color={theme.colors.primary}
                  disabled={!editTitle || !editDificultate || !editIngrediente.length || !editInstructiuni}
                />
              </View>
              <View>
                <Button
                  title="Cancel"
                  onPress={closeEditModal}
                  variant="primary"
                  color={theme.colors.primary}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal delete recipe */}
      <Modal visible={isDeleteModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContentRecipe}>
            <Text variant="title" sx={{ marginBottom: 15, justifyContent: 'center', fontSize: 18, color: theme.colors.cardTitle }}>
              Are you sure you want to delete recipe {recipe.titluReteta}?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Button sx={{ margin: 10 }} variant="primary" onPress={() => setIsDeleteModalVisible(false)} title="No" />
              <Button sx={{ margin: 10 }} variant="primary" onPress={deleteRecipe} title="Yes" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // Adjusted for padding and spacing

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5EEF8',
    borderRadius: 8,
    width: cardWidth,
    marginBottom: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    borderRadius: 8,
    height: 150,
    width: '100%',
  },
  title: {
    marginVertical: 8,
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 8,
    marginBottom: 4,
    marginTop: 4
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
    height: '25%', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalEditContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalEditContentRecipe: {
    backgroundColor:"#ffe6e6",
    padding: 30,
    borderRadius: 10,
    width: '90%',
    height: '90%', 
    justifyContent: 'center',
    alignItems: 'center',
  },
});