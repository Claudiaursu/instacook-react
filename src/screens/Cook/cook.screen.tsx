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
  const { data, error, isLoading } = useGetCollectionsByUserIdQuery(userParams);
  const [addNewCollection, {isSuccess: newCollectionSuccess }] = useAddNewCollectionMutation();
  
  const [isVisible, setIsVisible] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [isPrivateCollection, setIsPrivateCollection] = useState(false);

  const [newCollectionObj, setNewCollectionObj] = useState({
    titluColectie: "",
    descriereColectie: "",
    publica: true,
    calePoza: ""
  });


  const profileRedirect = (id: number) => {
    navigation.navigate("Profile", {refresh: id }); // Navigate to Profile screen
  };

  const createCollection = async function () {
    console.log("DATAAAAA ", newCollectionObj)

    const collectionProps = {
      ...newCollectionObj,
      utilizator: loggedId
    }
    
    try {

      const collectionCreateParams = {
        collection: collectionProps,
        token
      }
      const response: { data?: { id: string }; error?: any } = await addNewCollection(collectionCreateParams); // Adjust the type accordingly
      if (response && response.data && response.data.id) {
        console.log("response RESULT ", response.data)
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

  const openNewCollectionModal = () =>{
    setIsVisible(true);
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

  const setDescriereColectie = function (text: string) {
    setNewCollectionObj({
      ...newCollectionObj,
      descriereColectie: text
    })
  }


  const uploadImageAsync = async (uri: string) => {
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

    const collName = newCollectionObj.titluColectie;
    const imgPath = `${username}/${collName}/coll-pic.jpg`;
    const fileRef = ref(getStorage(), imgPath);

    try {
      const metadata = {
        contentType: 'image/jpeg'
      };
      
      const result = await uploadBytesResumable(fileRef, blob, metadata);
      //dispatch(setValue(imgPath))
      //return await getDownloadURL(fileRef);

      setNewCollectionObj({
        ...newCollectionObj,
        calePoza: imgPath
      })

    } catch (error) {
      console.log("ERROOOOOOOR ", error)
    }
  }

  const addCollectionPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
        //setImage(result.assets[0].uri);
        await uploadImageAsync(result.assets[0].uri);
    }
  }

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
          onPress={ () => createCollection() }
          title="Add recipe"/>
          </View>
        </View>



      <Modal visible={isVisible} animationType="slide" transparent>
        <View style={styles().modalContainer}>
          <View  style={styles().modalContent}>
          
            <Text 
            variant="title"
            sx={{marginBottom: 15, justifyContent: 'center'}}
            >
            Create your collection
            </Text>

            {/* <AddPhotoButton onPress={handleAddPhoto} /> */}

              <TextInput
                  label="Title"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(text) =>
                    setTitluColectie(text)
              }/>

              <TextInput
                label="Description"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text) =>
                  setDescriereColectie(text)
              }/>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text sx={{ marginRight: 8 }} >Private</Text>
            <Switch
              value={isPrivateCollection}
              onValueChange={togglePrivacy}
              thumbColor={isPrivateCollection ? 'pink' : '#f4f3f4'} // Pink when checked, default color when unchecked
              trackColor={{ false: '#f4f3f4', true: 'lightpink' }} // Default color when unchecked, light pink when checked

            />
          </View>

          <View>
          <Button 
            sx={{margin: 10}}
            variant="primary"
            onPress = { () => addCollectionPhoto() } 
            title="Add collection photo" />
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
        modalContent: {
          backgroundColor:"#ffe6e6",
          padding: 20,
          borderRadius: 10,
          width: '80%',
          justifyContent: 'center',
          alignItems: 'center'
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