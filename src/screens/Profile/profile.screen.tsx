import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView } from "react-native";
import { RootStackParamList } from "../../navigation/navigator.types";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import { TextInput } from "../../components/text-input";
import { View, Modal } from 'react-native';
import { StyleSheet } from "react-native";
import uuid from 'react-native-uuid';
import { Button } from "../../components/button";
import { Text } from "../../components/text";
import { useGetUserByUsernameQuery } from "../../services/user-interaction.service";
import { useDispatch, useSelector } from "react-redux";
import { updateToken } from "../../store/tokenSlice";
import { RootState } from "../../store/store";
import { PictureComponent } from "../../components/profile-picture/profile-picture.component";
import { selectProfilePhotoValue, setValue } from "../../store/profilePhoto.slice";
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject, uploadBytesResumable } from 'firebase/storage';


type HomeProps = NativeStackScreenProps<RootStackParamList, "Profile">;

const Profile = ({ navigation }: HomeProps) => {

    const username = useSelector((state: RootState) => state.userData.username);
    const dispatch = useDispatch();
    const { data, error, isLoading } = useGetUserByUsernameQuery(username);
    const [currentProfileVersion, setCurrentProfileVersion] = useState(1);


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

      const imgPath = `${username}/profile_image.jpg`;
      const fileRef = ref(getStorage(), imgPath);

      try {
        const metadata = {
          contentType: 'image/jpeg'
        };
        
        const result = await uploadBytesResumable(fileRef, blob, metadata);
        dispatch(setValue(imgPath))
        setCurrentProfileVersion(currentProfileVersion + 1);
        return await getDownloadURL(fileRef);

      } catch (error) {
        console.log("ERROOOOOOOR ", error)
      }
  }

    const uploadPhoto = async function () {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
          console.log("imagine ", result.assets[0])
          //setImage(result.assets[0].uri);
          await uploadImageAsync(result.assets[0].uri);
      }
    }

    useEffect(() => {
  }, [currentProfileVersion])

    const {
        theme,
        activeScheme,
        toggleThemeSchema
    } = useThemeConsumer();
 
    const logout = () => {
      dispatch(updateToken(""))
    }
  
    return (
   
    <View>
        <Text   
        sx = {
            {margin: 18,
                textAlign: 'center'  
            }} 
            variant = "title">Hello, {username}! 
        </Text>

        <Text   
        sx = {
            {margin: 5,
                textAlign: 'left'  
            }} 
            variant = "subtitle"> {data?.nume} {data?.prenume}
        </Text>

        <Text   
        sx = {
            {margin: 5,
                textAlign: 'left'  
            }} 
            variant = "subtitle"> {data?.email}
        </Text>

        <Text   
        sx = {
            {margin: 5,
                textAlign: 'left'  
            }} 
            variant = "subtitle"> {data?.taraOrigine}
        </Text>

        <PictureComponent></PictureComponent>

        <Button 
        sx={{margin: 10}}
        variant="primary"
        onPress = { () => uploadPhoto() } 
        title="Add profile photo" />

        <View style={{ flexDirection: "row" }}>
         <View>
          <Button 
          sx={{margin: 10}}
          variant="primary"
          //onPress = { () => openNewCollectionModal() } 
          title=" + " />
        </View>

        </View>

      {/* <AddCollectionModal
        isVisible={showForm}
        onClose={handleFormClose}
      /> */}

        <View>
        <Button 
         sx={{margin: 10}}
         variant="primary"
         onPress = { () => logout() } 
         title="Sign out"/> 
        </View>

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
        },
        input: {
          borderWidth: 1,
          borderColor: '#CCC',
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        },
      })
    }

export default Profile;