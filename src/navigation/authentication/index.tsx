import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { RootStackParamList } from "../navigator.types";
import { LoginForm } from "../../components/login/LoginForm";
import { RegisterForm } from "../../components/register/RegisterForm";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Authentication = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginForm} />
      <Stack.Screen name="Register" component={RegisterForm} />
    </Stack.Navigator>
  );
};