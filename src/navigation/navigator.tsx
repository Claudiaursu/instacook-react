import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Appearance } from "react-native";
import { useThemeConsumer } from "../utils/theme/theme.consumer";
import { Authentication } from "./authentication";
import { Dashboard } from "./dashboard";
import { LoginFormProvider, useLoginFormContext } from "../store/login.context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { RootState } from "../store/store"; 

export const Navigator = () => {
  const { activeScheme, toggleThemeSchema, theme } = useThemeConsumer();
  const { username, password, setLoginData, userToken } = useLoginFormContext();
  const [user, setUser] = useState("");

  const token = useSelector((state: RootState) => state.userData.token);

  console.log("userToken00000000 :", userToken.length);


  useEffect(() => {
    Appearance.addChangeListener((scheme) => {
      if (scheme.colorScheme !== activeScheme) {
        toggleThemeSchema();
      }
      
    });
    //setUser(userToken);
    console.log("NEW USERTOKEN ", userToken)
  }, [activeScheme, toggleThemeSchema, userToken]); // Include userToken here

  useEffect(() => {

  }, [userToken])

  
  return (
    <NavigationContainer theme={theme}>
     
      <LoginFormProvider>
     
      {token ? <Dashboard /> : 
      (
       
        <Authentication />
       
      )}

    </LoginFormProvider>
    
    </NavigationContainer>

    
  );
};