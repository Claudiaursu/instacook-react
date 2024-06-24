import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, Modal, FlatList, ScrollView } from 'react-native';
import { Text } from '../../components/text';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
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
import uuid from 'react-native-uuid';
import DropdownComponent from '../dropdown/dropdown.component';
import { CollectionDto, useGetCollectionsByUserIdQuery } from '../../services/collection.service';

export const RecipeComponent = ({ recipe, isOwner, handleDeleteUpdates }: { recipe: RecipeDto, isOwner: boolean, handleDeleteUpdates: any }) => {
  const navigation = useNavigation();
  const recipeDate = new Date(recipe.createdAt);
  const username = useSelector((state: RootState) => state.userData.username);
  const token = useSelector((state: RootState) => state.userData.token);
  const loggedId = useSelector((state: RootState) => state.userData.loggedId);

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

  // const [selectedRecipeImageUri, setSelectedCollectionImageUri] = useState<string | null>(null);

  const [selectedRecipeImageUri, setSelectedRecipeImageUri] = useState<any>("");

  const userParams = {
    id: loggedId,
    token: token
  }
  const { data: collectionList, error, isLoading } = useGetCollectionsByUserIdQuery(userParams);
  console.log(" collectionList", )

  const [newRecipeObj, setNewRecipeObj] = useState({
    titluReteta: recipe.titluReteta,
    dificultate: recipe.dificultate,
    ingrediente: recipe.ingrediente || [],
    instructiuni: recipe.instructiuni,
    calePoza: recipe.calePoza,
    colectie: {
      id: recipe.colectie.id
    }
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
        setSelectedRecipeImageUri(imgUrl)
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
    console.log("a intrat in fct de edit !!!!!!!!!!! ", newRecipe)
    
    if (selectedRecipeImageUri && selectedRecipeImageUri != imageUrl) {
      console.log("a intrat in fct de edit IF ", selectedRecipeImageUri)
      let imgPath = await uploadImageAsync(selectedRecipeImageUri, "recipes");
      if (imgPath){
        newRecipe.calePoza = imgPath;
      }
    }

    const recipeProps = { ...newRecipe };
    console.log("recipe props !!!!!!!!!!! ", recipeProps)
    const editRecipeParams = { recipe: recipeProps, token, id: recipe.id };

    try {
      await editRecipe(editRecipeParams);
      //handleDeleteUpdates(recipe.id); // Assuming this refreshes the recipe list
      setIsEditModalVisible(false);
      //setImageUrl(newRecipe.calePoza)
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
      calePoza: recipe.calePoza,
      colectie: {
        id: recipe.colectie.id
      }
    });

    setEditIngrediente(recipe.ingrediente)
    setSelectedRecipeImageUri(imageUrl)
  }

  const uploadImageAsync = async (uri: string, category: string) => {
    let imgPath;
    try {
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

    console.log("BLOB", blob)
    
    const randomUUID = uuid.v4();
    imgPath = `${username}/${category}/${randomUUID}.jpg`;
    const fileRef = ref(getStorage(), imgPath);
    
      const metadata = { contentType: 'image/jpeg' };
      await uploadBytesResumable(fileRef, blob, metadata);
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
      setSelectedRecipeImageUri(result.assets[0].uri);
    }
  }

  const setDificultateRecipe = function (text: string) {
    setNewRecipeObj({
      ...newRecipeObj,
      dificultate: text
    })
    setEditDificultate(text)
  }

  const setColectieRecipe = function (id: number) {
    setNewRecipeObj({
      ...newRecipeObj,
      colectie: {
        id: id.toString(),
      }
    })
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
            <ScrollView>
              <View style={{alignItems: 'center'}}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text variant="title" sx={{ marginBottom: 20, justifyContent: 'center' }}>
                  Edit your recipe
                </Text>
                </View>
              </View>
              <View>
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
              </View>


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
                    paddingBottom: 7, // Reduced paddingBottom for smaller space
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
              <View style={{marginBottom: 20}}>
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
                  keyExtractor={(item, index) => index.toString()} />
              </View>
             
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
                    marginTop: 10, // Reduced marginTop for smaller space
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
                initialSelection={recipe.dificultate}
              />

              <DropdownComponent
                data={collectionList ? collectionList.map(collection => ({ id: collection.id, titluColectie: collection.titluColectie })) as CollectionDto[] : []}
                action={setColectieRecipe}
                initialSelection={recipe.colectie.id?.toString() || ""}
              />


            <View style={{ alignItems: 'center', alignContent: 'center'}}>
                {selectedRecipeImageUri ? (
                  <TouchableOpacity onPress={addRecipePhoto}>
                    <Image
                      source={{ uri: selectedRecipeImageUri }}
                      style={styles.imagePicker}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={addRecipePhoto}>
                    <MaterialCommunityIcons
                      name="image-outline"
                      size={50}
                      color={theme.colors.primary}
                    />
                  </TouchableOpacity>
                )}
              </View>

             <View style={styles.modalButtons}>
              <View style={{margin: 10, alignItems: 'center'}}>
                <Button
                      title="Save"
                      onPress={updateRecipe}
                      variant="primary"
                      color={theme.colors.primary}
                      //disabled={!editTitle || !editDificultate || !editIngrediente.length || !editInstructiuni}
                    />
                </View>
                <View style={{margin: 10,  alignItems: 'center'}}>
                  <Button
                      title="Cancel"
                      onPress={closeEditModal}
                      variant="primary"
                      color={theme.colors.primary}
                    />
                </View>
             </View>

            </ScrollView>
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center' ,
    margin: 20,
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
  },
  imagePicker: {
    borderRadius: 60,
    height: 110,
    width: 110,
    marginBottom: 5,
  },
});

export default RecipeComponent;
