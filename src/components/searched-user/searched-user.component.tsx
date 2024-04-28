import { getDownloadURL, ref } from 'firebase/storage';
import {
  TextInput as NativeTextInput,
  TextInputProps as NativeTextInputProps,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { View, Image, Dimensions } from 'react-native';
import { useEffect, useState } from "react";
import { useThemeConsumer } from '../../utils/theme/theme.consumer';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { selectProfilePhotoValue, setValue } from '../../store/profilePhoto.slice';
import { storage } from '../../utils/firebase/firebase';
import { RootState, store } from '../../store/store';
import { Text } from '../text';
import React from 'react';
import { TextInput } from '../text-input';
import { useGetUsersBySearchQuery } from '../../services/user-interaction.service';
import { UserDto } from '../../services/user-interaction.service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SearchStackParamList } from '../../screens/Search/navigator.types';

export const SearchedUserComponent = (
  {user, onPress}: { user: UserDto, onPress: () => void }
) => {
  
  const loggedId = useSelector((state: RootState) => state.userData.loggedId);
  const token = useSelector((state: RootState) => state.userData.token); 


  useEffect(() => {
  }, [])

  const {
    theme,
    activeScheme,
    toggleThemeSchema
  } = useThemeConsumer();

  
    return (
      <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        {/* <Image
          source={{ uri: user.profilePic }}
          style={styles.profilePic}
        />
         */}

        <Text
        sx={{
          margin: 5,
          textAlign: 'left'
        }}
        variant="subtitle"> {user?.nume} {user?.prenume} - id: {user?.id}
      </Text>

      <Text
        sx={{
          margin: 5,
          textAlign: 'left'
        }}
        variant="subtitle"> {user?.username}
      </Text>

      </View>
      </TouchableOpacity>
    );

};

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 2 * CARD_MARGIN,
    marginHorizontal: CARD_MARGIN,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});