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


type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;

const Home = ({ navigation }: HomeProps) => {

  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.userData.username);

  const {
      theme,
      activeScheme,
      toggleThemeSchema
  } = useThemeConsumer();

    //const [showForm, setShowForm] = useState(false);
    // const handleButtonClick = () => {
    //   setShowForm(true);
    // };
  

    return (
   
    <View>
        <Text   
        sx = {
            {margin: 18,
                textAlign: 'center'  
            }} 
            variant = "title">Hello {username}! 
        </Text>

        <Text   
        sx = {
            {margin: 10,
                textAlign: 'center'  
            }} 
            variant = "subtitle">Your collections 
        </Text>

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

export default Home;