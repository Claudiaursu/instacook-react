import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Appearance } from "react-native";
import { useThemeConsumer } from "../utils/theme/theme.consumer";
import { Authentication } from "./authentication";
import { Dashboard } from "./dashboard";
import { LoginFormProvider } from "../store/login.context";

export const Navigator = () => {
  const { activeScheme, toggleThemeSchema, theme } = useThemeConsumer();
  const user  = null;

  Appearance.addChangeListener((scheme) => {
    if (scheme.colorScheme !== activeScheme) {
      toggleThemeSchema();
    }
  });

  return (
    // <NavigationContainer theme={theme}>
    //   {user ? <Dashboard /> : <Authentication />}
    // </NavigationContainer>

    <LoginFormProvider>
    <Authentication />
    </LoginFormProvider>
  );
};