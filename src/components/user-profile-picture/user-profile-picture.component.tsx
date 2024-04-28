import { getDownloadURL, ref } from 'firebase/storage';
import {
  TextInput as NativeTextInput,
  TextInputProps as NativeTextInputProps,
  StyleSheet
} from "react-native";
import { View, Image, FlatList } from 'react-native';
import { useEffect, useState } from "react";
import { useThemeConsumer } from '../../utils/theme/theme.consumer';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { selectProfilePhotoValue, setValue } from '../../store/profilePhoto.slice';
import { storage } from '../../utils/firebase/firebase';
import { RootState, store } from '../../store/store';
import { Text } from '../text';
import React from 'react';


export const UserPictureComponent = ({photoPath}: {photoPath: string}) => {
  
    const [imageUrl, setImageUrl] = useState("profile_images/default.png");
    const [loading, setLoading] = useState(true); 

    const getPicture = async () => {
        const imgRef = ref(storage, photoPath);
        const imgUrl = await getDownloadURL(imgRef);
        console.log("----- --------------------download  ", imageUrl)

        setImageUrl(imgUrl); 
        setLoading(false);
    }


    useEffect(() => {
      console.log("-----S-A SCHIMBAT POZA (cont alt user) ", imageUrl)
      getPicture();
    }, [photoPath])

  const {
    theme,
    activeScheme,
    toggleThemeSchema
  } = useThemeConsumer();


  if (loading) {
    return <Text/>;
  } else {

 

  if(imageUrl !== 'profile_images/default.png'){
    return (
     
      <Provider store={store}> 
        <>
          <View>
                <Image 
                source = {{uri: imageUrl}}
                style = {{borderRadius: 99999, height: 100, width: 100, margin: 10}}
                />
          </View>
        </>
        </Provider>
     
      
    )
  } else {
    return (
      <View>
        <Image 
          source = {{uri: imageUrl}}
          style = {{borderRadius: 99999, height: 190, width: 190, margin: 10}}
        />
      </View>
    )
  }
}

};

const styles = (activeSchema: string) =>{
  return StyleSheet.create({
      picture: {
          height: 225,
          width: 225,
          backgroundColor: activeSchema == 'light' ? "#ccccff": "#b82e8a",
          padding: 10,
          borderRadius: 8,
          borderWidth: 3,
          margin: 10,
          borderColor: activeSchema == 'light' ? "#cce6ff": "#8f246b"
        }
  });
    
}