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

export const LoginForm = () => {
  const {
    theme: { colors },
  } = useThemeConsumer();
 
  const styles = loginStyles(colors);

  const {username, password, setLoginData} = useLoginFormContext();
  const [error, setError] = useState("");
  const clearError = () => setError("");


  const handleLogin = async () => {
    try {
      console.log(username, " + ", password)
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  return (
    <SafeAreaView style={styles.authContainer}>
      <Text sx={styles.signInLabel} variant="title">
        Sign in
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
      title="Sign in"/>
     
      
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
          // onPress={() => navigation.navigate("Register")}
          sx={styles.createNewAccount}
        >
          Create one
        </Text>
      </View>

    </SafeAreaView>
  );
};

