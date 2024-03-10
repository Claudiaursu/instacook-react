import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeProvider } from './src/utils/theme/theme.provider';
import { LoginFormProvider } from './src/store/login.context';
import { LoginForm } from './src/components/login/LoginForm';
import { Provider } from 'react-redux';
import { store } from './src/store/store';

export default function App() {
  return (
    // <View style={styles.container}>
    //   {/* <Text>Open up App.tsx to start working on your app!</Text>
    //   <StatusBar style="auto" /> */}
    // </View>

    <Provider store = {store}>
      <ThemeProvider>
      <LoginFormProvider> 
       

          <LoginForm/>
      </LoginFormProvider> 
    </ThemeProvider>  
    </Provider>
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
