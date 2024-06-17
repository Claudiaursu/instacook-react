import { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from '../text';
import { Button } from '../button';
import { TextInput } from "../text-input";
import { useLoginFormContext } from "../../store/login.context";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import React from "react";
import { useDoLoginMutation } from '../../services/auth.service';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/navigator.types";
import loginStyles from "./Register.styles";

type RegisterProps = NativeStackScreenProps<RootStackParamList, "Register">;

export const RegisterForm = ({ navigation }: RegisterProps) => {
  const {
    theme: { colors },
  } = useThemeConsumer();

  const styles = loginStyles(colors);

  const { username, password, setLoginData } = useLoginFormContext();
  const { theme, activeScheme, toggleThemeSchema } = useThemeConsumer();

  const [error, setError] = useState("");
  const clearError = () => setError("");
  const [doLogin, { isSuccess: loginSuccess }] = useDoLoginMutation();

  const registerUser = async () => {
    // Registration logic
  };

  const handleRegister = async () => {
    try {
      console.log("new user from form ", newUserObj)
     
      navigation.navigate("Login");
    } catch (error) {
     console.log(error)
    }
  };

  const [newUserObj, setNewUserObj] = useState({
    nume: "",
    prenume: "",
    username: "",
    parola: "",
    email: "",
    taraOrigine: "",
    telefon: ""
  });

  const setPrenume = (text: string) => {
    setNewUserObj({ ...newUserObj, prenume: text });
  };

  const setNume = (text: string) => {
    setNewUserObj({ ...newUserObj, nume: text });
  };

  const setUsername = (text: string) => {
    setNewUserObj({ ...newUserObj, username: text });
  };

  const setParola = (text: string) => {
    setNewUserObj({ ...newUserObj, parola: text });
  };

  const setEmail = (text: string) => {
    setNewUserObj({ ...newUserObj, email: text });
  };

  const setTaraOrigine = (text: string) => {
    setNewUserObj({ ...newUserObj, taraOrigine: text });
  };

  const setTelefon = (text: string) => {
    setNewUserObj({ ...newUserObj, telefon: text });
  };

  const verifyPassword = (text: string) => {
    const currentSetPassword = newUserObj.parola;
    if (text !== currentSetPassword) {
      console.log("Password does not match");
    }
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text sx={styles.signInLabel} variant="title">
        Register
      </Text>
        
        <TextInput
          onFocus={clearError}
          value={newUserObj.prenume}
          label="First Name"
          onChangeText={setPrenume}
        />
        <TextInput
          value={newUserObj.nume}
          label="Last Name"
          onChangeText={setNume}
        />
        <TextInput
          value={newUserObj.username}
          label="Username"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setUsername}
        />
        <TextInput
          value={newUserObj.parola}
          label="Password"
          secureTextEntry
          onChangeText={setParola}
        />
        <TextInput
          value={newUserObj.parola}
          label="Confirm Password"
          secureTextEntry
          onChangeText={verifyPassword}
        />
        <TextInput
          value={newUserObj.email}
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setEmail}
        />
        <TextInput
          value={newUserObj.taraOrigine}
          label="Country of Origin"
          onChangeText={setTaraOrigine}
        />
        <TextInput
          value={newUserObj.telefon}
          label="Phone"
          keyboardType="phone-pad"
          onChangeText={setTelefon}
        />

        {error && <Text sx={styles.errorText}>{error}</Text>}

        <Button sx={styles.signInButton} onPress={handleRegister} title="Register" />

        <Button
          variant="primary"
          onPress={() => toggleThemeSchema()}
          title="Switch theme"
        />

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
          <Text>Already have an account?</Text>
          <Text
            onPress={() => navigation.navigate("Login")}
            sx={styles.createNewAccount}
          >
            Sign in instead
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
