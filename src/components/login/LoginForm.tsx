import { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import loginStyles from "./Login.styles";
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
import { useDispatch, useSelector } from "react-redux";
import { updateToken, updateUsername, updateLoggedId } from "../../store/tokenSlice";
import { setValue } from "../../store/profilePhoto.slice";
import { decode } from "base-64";
global.atob = decode;
import { jwtDecode } from "jwt-decode";
import { RootState } from "../../store/store";
import { useCountUnseenNotificationsQuery } from "../../services/notifications";
import { updateunseenNotifications } from "../../store/notifications";

type HomeProps = NativeStackScreenProps<RootStackParamList, "Login">;

export const LoginForm = ({ navigation }: HomeProps) => {
  const {
    theme: { colors },
  } = useThemeConsumer();

  const styles = loginStyles(colors);

  const { username, password, setLoginData } = useLoginFormContext();
  const { theme, toggleThemeSchema } = useThemeConsumer();
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const clearError = () => setError("");
  const [doLogin] = useDoLoginMutation();

  // Use selectors to get the userId and token from the Redux store
  const userId = useSelector((state: RootState) => state.userData.loggedId);
  const token = useSelector((state: RootState) => state.userData.token);

  console.log(userId, " & ", token);

  const [uuid, setUuid] = useState<number>(0);
  const [t, setT] = useState<string>("");

  // Define params for useCountUnseenNotificationsQuery
  const params = {
    id: userId,
    token: token,
  };

  const { data: notificationsData, refetch: refetchNotifications } = useCountUnseenNotificationsQuery(params, {
    skip: !userId || !token,
  });

  useEffect(() => {
    console.log("schimbare de id si token", userId," &&& ",  token)
    if (userId && token) {
      refetchNotifications();
    }
  }, [userId, token]);

  useEffect(() => {
    if (notificationsData) {
      const notifCount = notificationsData.count ?? 0;
      dispatch(updateunseenNotifications(notifCount));
    }
  }, [notificationsData]);

  useEffect(() => {
    console.log(uuid, t)
  }, [uuid, t]);

  const handleLogin = async () => {
    try {
      console.log(username, " + ", password);

      const loginObj = {
        username: username,
        parola: password,
      };

      const res = await doLogin(loginObj);
      if ('data' in res) {
        const token = res.data.token;
        dispatch(updateToken(token));
        dispatch(updateUsername(username));

        const decoded = jwtDecode(token) as any;
        const userId = decoded.id || 0;

        dispatch(updateLoggedId(parseInt(userId)));

        // setT(token);
        // setUuid(parseInt(userId))

        console.log(t)
        console.log(uuid)

        setLoginData({
          username: "",
          password: "",
        });

        const profilePicUrl = `${username}/profile_image.jpg`;
        dispatch(setValue(profilePicUrl));

      } else if ('error' in res) {
        console.log('Error:', res.error);
        setError("The password or the username are incorrect");
      }

    } catch (err: any) {
      console.log("err ", err);
      setError("The password or the username are incorrect");
    }
  };

  const redirectToRegister = () => {
    navigation.navigate("Register");
    setLoginData({
      username: "",
      password: "",
    });
  };

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
            password,
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

      <Button sx={styles.signInButton} onPress={handleLogin} title="Sign in" />

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
