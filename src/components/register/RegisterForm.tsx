import { useContext, useRef, useState } from "react";
import { SafeAreaView } from "react-native";
import { View } from 'react-native'
import loginStyles from "./Register.styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from '../text';
import { Button } from '../button';
import { TextInput } from "../text-input";
import { useLoginFormContext } from "../../store/login.context";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import React from "react";
import { useDoLoginMutation } from '../../services/auth.service';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/navigator.types";

type RegisterProps = NativeStackScreenProps<RootStackParamList, "Register">;

export const RegisterForm = ({navigation}: RegisterProps) => {
  const {
    theme: { colors },
  } = useThemeConsumer();
 
  const styles = loginStyles(colors);

  const { username, password, setLoginData } = useLoginFormContext();
  const { theme, activeScheme, toggleThemeSchema } = useThemeConsumer();

  const [error, setError] = useState("");
  const clearError = () => setError("");
  const [doLogin, {isSuccess: loginSuccess }] = useDoLoginMutation();

  const handleLogin = async () => {
    try {
      console.log(username, " + ", password)

      const loginObj = {
        email: username,
        parola: password
      }

      let token;
      const res = await doLogin(loginObj);
      if ('data' in res) {
        token = res.data.token;
        console.log("TOKEN ", token)

        await AsyncStorage.setItem("username", username);
        await AsyncStorage.setItem("token", token);

      } else if ('error' in res) {
        console.log('Error:', res.error);
      }

    } catch (err: any) {
      console.log("err ", err)
    }
  };


  //varianta alternativa
  const getTokenFromApiAsync = async () => {
    try {
      const response = await fetch(
        "http://192.168.100.46:8080/v1/auth/login",
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: username,
            parola: password,
          }),
        }
      );

      const json = await response.json();
      console.log("RESPONSE ", json);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <SafeAreaView style={styles.authContainer}>
      <Text sx={styles.signInLabel} variant="title">
        Create a new account
      </Text>

      <TextInput
        onFocus={clearError}
        value={username}
        label="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(text) =>
          setLoginData({
            username: text,
            password
          })
        }
      />
      <TextInput
        value={password}
        label="Password"
        secureTextEntry 
        onChangeText={(text) =>
          setLoginData({
            username,
            password: text,
          })
        }
      />

      <Button sx={styles.signInButton}
      onPress={handleLogin} 
      title="Create account"/>

      <Button 
      variant="primary"
      onPress = { () => toggleThemeSchema() } 
      title="Switch theme" />
     
      
     <View style={styles.orContainer}>
        <View style={styles.orContainerLine} />
        <Text>OR</Text>
        <View style={styles.orContainerLine} />
      </View>
      <View style={styles.logoOuterContainer}>
        <View style={styles.logoContainer}>
          <Ionicons name="logo-facebook" size={30} />
          <Ionicons name="logo-google" size={30} 
            // onPress={() => onGoogleButtonPress}
          />
          <Ionicons name="logo-apple" size={30} />
        </View>
      </View>
      <View style={styles.newAccount}>
        <Text>Have an account?</Text>
        <Text
          onPress={() => navigation.navigate("Login")}
          sx={styles.createNewAccount}
        >
          Login
        </Text>
      </View>

    </SafeAreaView>
  );
};
