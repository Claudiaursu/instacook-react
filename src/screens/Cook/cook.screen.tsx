import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Switch, TouchableOpacity } from "react-native";
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
import { useAddNewRecipeMutation } from "../../services/recipe.service";
import DropdownComponent from "../../components/dropdown/dropdown.component";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ImagePickerSuccessResult } from "expo-image-picker";


type CookProps = NativeStackScreenProps<RootStackParamList, "Cook">;

const Cook = ({ navigation }: CookProps) => {

  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.userData.username);
  const loggedId = useSelector((state: RootState) => state.userData.loggedId);
  const token = useSelector((state: RootState) => state.userData.token);

  const userParams = {
    id: loggedId,
    token: token
  }
  const { data: collectionList, error, isLoading } = useGetCollectionsByUserIdQuery(userParams);
  const [addNewCollection, {isSuccess: newCollectionSuccess }] = useAddNewCollectionMutation();
  const [addNewRecipe, {isSuccess: newRecipeSuccess }] = useAddNewRecipeMutation();
  
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleRecipe, setIsVisibleRecipe] = useState(false);
  
  const [isPrivateCollection, setIsPrivateCollection] = useState(false);
  
  const [selectedRecipeImageUri, setSelectedRecipeImageUri] = useState<ImagePickerSuccessResult>();
  const [selectedCollectionImageUri, setSelectedCollectionImageUri] = useState<ImagePickerSuccessResult>();


  const recipeDificulties = [{
      id: 1,
      value: "Easy"
    },
    {
      id: 2,
      value: "Intermediate"
    },
    {
      id: 3,
      value: "Hard"
    },
    {
      id: 4,
      value: "Extra hard"
    }]

    const [newCollectionObj, setNewCollectionObj] = useState({
    titluColectie: "",
    descriereColectie: "",
    publica: true,
    calePoza: ""
  });

  const [newRecipeObj, setNewRecipeObj] = useState({
    titluReteta: "",
    dificultate: "",
    ingrediente: [],
    instructiuni: "",
    calePoza: "",
    colectie: ""
  });


  const profileRedirect = (id: number) => {
    navigation.navigate("Profile", {refresh: id }); // Navigate to Profile screen
  };

  const createCollection = async function () {
    let newCollection = newCollectionObj;
    if (selectedCollectionImageUri) {
      let imgPath = await uploadImageAsync(selectedCollectionImageUri.assets[0].uri, "collections");      
      newCollection.calePoza = imgPath;
    }

    const collectionProps = {
      ...newCollection,
      utilizator: loggedId
    }

    try {

      const collectionCreateParams = {
        collection: collectionProps,
        token
      }
      const response: { data?: { id: string }; error?: any } = await addNewCollection(collectionCreateParams); // Adjust the type accordingly
      if (response && response.data && response.data.id) {
        profileRedirect(parseInt(response.data.id))
      }
    } catch (error) {
      console.log("eoare creare colectie: ", error)
    } 

  
    setNewCollectionObj({
      titluColectie: "",
      descriereColectie: "",
      publica: true,
      calePoza: ""
    });

    setIsVisible(false);
  }

  const clearRecipeData = () => {
    setNewRecipeObj({
      titluReteta: "",
      dificultate: "",
      ingrediente: [],
      instructiuni: "",
      calePoza: "",
      colectie: ""
    });
    setSelectedRecipeImageUri(undefined);
  }

  const createRecipe = async function () {
    let newRecipe = newRecipeObj;
    if (selectedRecipeImageUri) {
      let imgPath = await uploadImageAsync(selectedRecipeImageUri.assets[0].uri, "recipes");      
      newRecipe.calePoza = imgPath;
    }
        
    try {

      const recipeCreateParams = {
        recipe: newRecipe,
        token
      }
      const response: { data?: { id: string }; error?: any } = await addNewRecipe(recipeCreateParams); // Adjust the type accordingly
      if (response && response.data && response.data.id) {
        profileRedirect(parseInt(response.data.id))
      }
    } catch (error) {
      console.log("eoare creare reteta: ", error)
    } 

    setIsVisibleRecipe(false);
    recipeCleanupOnClose();
  }

  const openNewCollectionModal = () =>{
    setIsVisible(true);
 }

  const openNewRecipeModal = () =>{
    setIsVisibleRecipe(true);
  }

  const handleFormSubmit = async () => {
    setIsVisible(false);
  };

  const togglePrivacy = () => {
    setIsPrivateCollection(!isPrivateCollection);
    setNewCollectionObj({
      ...newCollectionObj,
      publica: isPrivateCollection
    })
  }

  const setTitluColectie = function (text: string) {
    setNewCollectionObj({
      ...newCollectionObj,
      titluColectie: text
    })
  }

  const setTitluRecipe = function (text: string) {
    setNewRecipeObj({
      ...newRecipeObj,
      titluReteta: text
    })
  }

  const setDificultateRecipe = function (text: string) {
    setNewRecipeObj({
      ...newRecipeObj,
      dificultate: text
    })
  }

  const setIngredienteRecipe = function (list: Array<string>) {
    setNewRecipeObj({
      ...newRecipeObj,
      ingrediente: []
    })
  }

  const setInstructiuniRecipe = function (text: string) {
    setNewRecipeObj({
      ...newRecipeObj,
      instructiuni: text
    })
  }

  const setCalePozaRecipe = function (text: string) {
    setNewRecipeObj({
      ...newRecipeObj,
      calePoza: text
    })
  }

  const setColectieRecipe = function (id: number) {
    setNewRecipeObj({
      ...newRecipeObj,
      colectie: id.toString()
    })
  }


  const setDescriereColectie = function (text: string) {
    setNewCollectionObj({
      ...newCollectionObj,
      descriereColectie: text
    })
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
      setNewRecipeObj({
        ...newRecipeObj,
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

  const addCollectionPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedCollectionImageUri(result);
    }
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

  const recipeCleanupOnClose = () => {
    setIsVisibleRecipe(false);
    clearRecipeData();
  }

  useEffect(() => {
  }, [selectedRecipeImageUri]);


  const {
      theme
  } = useThemeConsumer();  

    return (
   
    <View style={{ flex: 1 }}>

        <View style={{ flex: 1, backgroundColor: theme.colors.background2}}>
          <View style={{  justifyContent: 'center', alignItems: 'center' }}>
            <Text   
            sx = {
                {marginTop: 7 }} 
                variant = "title">Let's inspire other cookers, {username}! 
            </Text>
          </View>

            <View style={{  flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <View style={{  justifyContent: 'center', alignItems: 'center' }}>
              <Button sx={{margin: 1}}
              onPress={ () => openNewCollectionModal() }
              title="Add collection"/>
              </View>
            </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        <View style={{  justifyContent: 'center', alignItems: 'center' }}>
          <Button sx={{margin: 1}}
          onPress={() => openNewRecipeModal() }
          title="Add recipe"/>
          </View>
        </View>



      <Modal visible={isVisible} animationType="slide" transparent>
        <View style={styles().modalContainer}>
          <View  style={styles().modalContentCollection}>
          
          <View style={{ alignItems: 'center'}}>
          <Text 
            variant="title"
            sx={{marginBottom: 15, justifyContent: 'center'}}
            >
            Create your collection
            </Text>
          </View>
            

            {/* <AddPhotoButton onPress={handleAddPhoto} /> */}

            <View  style={{ margin: 15}}>
                <TextInput
                    label="Title"
                    keyboardType="email-address"
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
                    onChangeText={(text) =>
                      setTitluColectie(text)
                }/>

                <TextInput
                  label="Description"
                  keyboardType="email-address"
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
                  onChangeText={(text) =>
                    setDescriereColectie(text)
                }/>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text sx={{
              marginRight: 8,
              color: theme.colors.cardTitle,
              fontSize: 14,
              fontWeight: "bold" 
              }} >Private</Text>
              <Switch
                value={isPrivateCollection}
                onValueChange={togglePrivacy}
                thumbColor={isPrivateCollection ? 'pink' : '#f4f3f4'} // Pink when checked, default color when unchecked
                trackColor={{ false: '#f4f3f4', true: 'lightpink' }} // Default color when unchecked, light pink when checked

              />
            </View>
          </View>

          <View style={{ alignItems: 'center', alignContent: 'center'}}>
              {selectedCollectionImageUri ? (
            <TouchableOpacity onPress={addCollectionPhoto}>
              <Image
                source={{ uri: selectedCollectionImageUri.assets[0].uri }}
                style={styles().image}
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

          <View style={{marginTop: 10,  alignItems: 'center'}} >
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Button 
            sx={{margin: 10}}
            variant="primary"
            onPress = { () => { setIsVisible(false);} } 
            title="Close" />
            
            <Button 
            sx={{margin: 10}}
            variant="primary"
            onPress = { () => createCollection() } 
            title="Submit" />
          </View>
          </View>
          
          </View>
        </View>
      </Modal>


      <Modal visible={isVisibleRecipe} animationType="slide" transparent>
        <View style={styles().modalContainer}>
          <View  style={styles().modalContentRecipe}>
          
          <View style={{ alignItems: 'center', marginTop: 1, marginBottom: 10}}>
          <Text 
            variant="title"
            sx={{marginBottom: 15, justifyContent: 'center'}}
            >
            Create your recipe
          </Text>
          </View>


          <View  style={{ margin: 15}}>
          <TextInput
                label="Title"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    textAlign: 'left', // Align text to the left
                    paddingLeft: 1, // Add left padding for better visual
                    paddingTop: 7,
                    paddingBottom: 25,
                  }}
                  textStyle = {{
                    color: theme.colors.cardTitle,
                    fontSize: 14,
                    fontWeight: "bold"
                  }}
                  onChangeText={(text) =>
                    setTitluRecipe(text)
            }/> 

              <TextInput
                label="Ingredients"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  textAlign: 'left', // Align text to the left
                  paddingLeft: 1, // Add left padding for better visual
                  paddingTop: 7,
                  paddingBottom: 25,
                }}
                textStyle = {{
                  color: theme.colors.cardTitle,
                  fontSize: 14,
                  fontWeight: "bold"
                }}
                onChangeText={(text) =>
                  setIngredienteRecipe([])
              }/>

              <TextInput
                label="Instructions"
                keyboardType="email-address"
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
                onChangeText={(text) =>
                  setInstructiuniRecipe(text)
              }/>

          <DropdownComponent data={recipeDificulties || []} action={setDificultateRecipe}
          ></DropdownComponent> 

          <DropdownComponent data={collectionList || []} action={setColectieRecipe}
          ></DropdownComponent>  

          </View>

       
          <View  style={{ alignItems: 'center', alignContent: 'center'}}>

      {selectedRecipeImageUri ? (
         <TouchableOpacity onPress={addRecipePhoto}>
          <Image
            source={{ uri: selectedRecipeImageUri.assets[0].uri }}
            style={styles().image}
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
          <View style={{marginTop: 10,  alignItems: 'center'}} >
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Button 
            sx={{margin: 10}}
            variant="primary"
            onPress = { () => {recipeCleanupOnClose();} } 
            title="Close" />
            
            <Button 
            sx={{margin: 10}}
            variant="primary"
            onPress = { () => createRecipe() } 
            title="Submit" />
          </View>
          </View>
          
          </View>
        </View>
      </Modal>

        

       
    </View>
    )
}

const styles = () => {
    return StyleSheet.create({
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
        image: {
          borderRadius: 60,
          height: 110,
          width: 110,
          marginBottom: 5,
          //borderRadius: 50, 
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
      })
    }

export default Cook;