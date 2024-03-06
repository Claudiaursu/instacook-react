import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeProvider } from './src/utils/theme/theme.provider';
import { LoginFormProvider } from './src/store/login.context';
import { LoginForm } from './src/components/login/LoginForm';

export default function App() {
  return (
    // <View style={styles.container}>
    //   {/* <Text>Open up App.tsx to start working on your app!</Text>
    //   <StatusBar style="auto" /> */}
    // </View>

  <ThemeProvider>
      <LoginFormProvider> 
          <LoginForm/>
      </LoginFormProvider> 
    </ThemeProvider>  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
