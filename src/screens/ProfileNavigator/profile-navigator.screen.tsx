import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { RootStackParamList } from "../../navigation/navigator.types";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { SearchComponent } from "../../components/search/search.component";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProfile from "../UserProfile";
import { ProfileStackParamList } from "./navigator.types";
import CollectionInfo from "../CollectionInfo/collectionInfo.screen";
import Profile from "../Profile/profile.screen";
import RecipeInfo from "../RecipeInfo/recipeInfo.screen";

type HomeProps = NativeStackScreenProps<RootStackParamList, "Profile">;
const Stack = createNativeStackNavigator<ProfileStackParamList>();


export const ProfileNavigator = ({ route, navigation }: {route: any, navigation: HomeProps}) => {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.userData.username);

  const {
      theme,
      activeScheme,
      toggleThemeSchema
  } = useThemeConsumer();  

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="ProfilePage" component={Profile} initialParams={{refresh: 1}}/>
          <Stack.Screen name="CollectionInfo" component={CollectionInfo} />
          <Stack.Screen name="RecipeInfo" component={RecipeInfo} />
        </Stack.Navigator>
    );
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

export default ProfileNavigator;