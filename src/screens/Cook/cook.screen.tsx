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
import { useDispatch, useSelector } from "react-redux";
import { updateToken } from "../../store/tokenSlice";
import { RootState } from "../../store/store";
import { useGetCollectionsByUserIdQuery } from "../../services/collection.service";

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

  const createCollection = function () {
    console.log("DATAAAAA ", data)
  }

  const {
      theme,
      activeScheme,
      toggleThemeSchema
  } = useThemeConsumer();  

    return (
   
    <View>
        <Text   
        sx = {
            {margin: 18,
                textAlign: 'center'  
            }} 
            variant = "title">Let's inspire other cookers, {username}! 
        </Text>

        <Button sx={{margin: 10}}
        onPress={ () => createCollection() }
        title="Add collection"/>

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

export default Cook;