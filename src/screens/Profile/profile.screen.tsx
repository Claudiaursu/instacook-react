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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGetCollectionsByUserIdQuery } from "../../services/collection.service";
import { TabViewProfile } from "../../components/tab-view-profile/tab-view-profile.component";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SearchComponent } from "../../components/search/search.component";
import { UserPictureComponent } from "../../components/user-profile-picture/user-profile-picture.component";
import { useGetRecipesByUserIdQuery } from "../../services/recipe.service";


type HomeProps = NativeStackScreenProps<RootStackParamList, "Profile">;
const Tab = createMaterialTopTabNavigator();


const Profile = ({ navigation }: HomeProps) => {

    const username = useSelector((state: RootState) => state.userData.username);
    const loggedId = useSelector((state: RootState) => state.userData.loggedId);
    const token = useSelector((state: RootState) => state.userData.token);  
   
    const dispatch = useDispatch();
    const { data: userData, error: userError, isLoading: userLoading } = useGetUserByUsernameQuery(username);
    const { data: recipesData, error: recipesError, isLoading: recipesLoading } = useGetRecipesByUserIdQuery({ id: loggedId, token });

    const profilePhotoText = userData?.pozaProfil === "profile_images/default.png" ? "Add photo" : "Edit photo"
    const recipeCount = recipesData ? recipesData.length: 0;


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
          //setImage(result.assets[0].uri);
          await uploadImageAsync(result.assets[0].uri);
      }
    }


    useEffect(() => {
      console.log(">>>>>>", userData)
  }, [userData])

    const {
        theme,
        activeScheme,
        toggleThemeSchema
    } = useThemeConsumer();
 
    const logout = () => {
      dispatch(updateToken(""))
    }
  
    return (
   
    <View style={{ flex: 1 }}>       
      
      {/* Detalii cont + Poza  */}
      <View style={{ flexDirection: 'row', backgroundColor: theme.colors.background2 }}>
      
      <View style={{ flex: 1,  marginTop: 7, marginBottom: 7 }}>

      <View style={{ flexDirection: 'row', margin: 5}}>
      <MaterialCommunityIcons name="chef-hat" size={24} color={theme.colors.primary} />
      <Text   
      sx = {
          {
              textAlign: 'left'  
          }} 
          variant = "profileTitle">{username}
      </Text>
      </View>

      <Text
        sx={{
          margin: 5,
          textAlign: 'left'
        }}
        variant="subtitle"> {userData?.nume} {userData?.prenume}
      </Text>

      <Text
        sx={{
          margin: 5,
          textAlign: 'left'
        }}
        variant="subtitle"> {userData?.email}
      </Text>

      <Text
        sx={{
          margin: 5,
          textAlign: 'left'
        }}
        variant="subtitle"> {userData?.taraOrigine}
      </Text>

       {/* Nr Retete + Followers + Follows  */}
      <View style={{ flexDirection: 'row',  marginTop: 7 }}>
        <View>
        <Text
          sx={{
            margin: 5,
            textAlign: 'center'
          }}
          variant="subtitle"> Followers
        </Text>
          <Text
          sx={{
            margin: 5,
            textAlign: 'center'
          }}
          variant="subtitle"> {userData?.followers.length}
        </Text>
        </View>

        <View>
          <Text
            sx={{
              margin: 5,
              textAlign: 'center'
            }}
            variant="subtitle"> Follows
          </Text>
            <Text
            sx={{
              margin: 5,
              textAlign: 'center'
            }}
            variant="subtitle"> {userData?.follows.length}
          </Text>
        </View>

        <View>
        <Text
            sx={{
              margin: 5,
              textAlign: 'center'
            }}
            variant="subtitle"> Recipes
          </Text>
            <Text
            sx={{
              margin: 5,
              textAlign: 'center'
            }}
            variant="subtitle"> {recipeCount}
          </Text>
        </View>

      </View>
        
      </View>

      <View style={{ marginTop: 7 }}>
        <View style={{  justifyContent: 'center', alignItems: 'center'}}>
        <UserPictureComponent photoPath={userData?.pozaProfil || ''}/>
        </View>

        <View>
        <Button 
          sx={{margin: 10}}
          variant="profile"
          onPress = { () => uploadPhoto() } 
          title={profilePhotoText} />
        </View>
      </View>
      
    </View>

    <TabViewProfile userId={loggedId}/>

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
        container: {
          flexDirection: 'row', // Set flexDirection to 'row' to place components next to each other horizontally
          alignItems: 'center', 
        }
      })
    }

export default Profile;