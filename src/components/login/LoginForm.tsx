import { useContext, useRef, useState } from "react";
import { SafeAreaView } from "react-native";
import { View } from 'react-native'
import loginStyles from "./Login.styles";
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
import { useDispatch } from "react-redux";
import { updateToken, updateUsername } from "../../store/tokenSlice";
import { selectProfilePhotoValue, setValue } from "../../store/profilePhoto.slice";


type HomeProps = NativeStackScreenProps<RootStackParamList, "Login">;

export const LoginForm = ({navigation}: HomeProps) => {
  const {
    theme: { colors },
  } = useThemeConsumer();
 
  const styles = loginStyles(colors);

  const { username, password, setLoginData, userToken } = useLoginFormContext();
  const { theme, activeScheme, toggleThemeSchema } = useThemeConsumer();
  const dispatch = useDispatch();


  const [error, setError] = useState("");
  const clearError = () => setError("");
  const [doLogin, {isSuccess: loginSuccess }] = useDoLoginMutation();

  const handleLogin = async () => {
    try {
      console.log(username, " + ", password)

      const loginObj = {
        username: username,
        parola: password
      }

      let token;
      const res = await doLogin(loginObj);
      if ('data' in res) {
        token = res.data.token;
        dispatch(updateToken(token))
        dispatch(updateUsername(username))

        setLoginData({
          username:"",
          password: "",
        })

        const profilePicUrl = `${username}/profile_image.jpg`;
        dispatch(setValue(profilePicUrl))

      } else if ('error' in res) {
        console.log('Error:', res.error);
        setError("The password or the username are incorrect")
      }

    } catch (err: any) {
      console.log("err ", err)
      setError("The password or the username are incorrect")
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

  const redirectToRegister = () => {
    navigation.navigate("Register")
    setLoginData({
      username:"",
      password: "",
    })
  }
  
  return (
    <SafeAreaView style={styles.authContainer}>
      <Text sx={styles.signInLabel} variant="title">
        Sign in
      </Text>

      <TextInput
        onFocus={clearError}
        value={username}
        label="Username"
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

      {error && <Text sx={styles.errorText}>{error}</Text>}

      <Button sx={styles.signInButton}
      onPress={handleLogin} 
      title="Sign in"/>

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
        <Text>Don't have an account?</Text>
        <Text
          onPress={() => redirectToRegister()}
          sx={styles.createNewAccount}
        >
          Create one
        </Text>
      </View>

    </SafeAreaView>
  );
};
