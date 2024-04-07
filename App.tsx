import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ThemeProvider } from './src/utils/theme/theme.provider';
import { LoginFormProvider } from './src/store/login.context';
import { LoginForm } from './src/components/login/LoginForm';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { Navigator } from './src/navigation/navigator';
import { NavigationContainer } from "@react-navigation/native";
import { useThemeConsumer } from './src/utils/theme/theme.consumer';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function App() {
  const { activeScheme, toggleThemeSchema, theme } = useThemeConsumer();
  
  return (


    // <View style={styles.container}>
    //   {/* <Text>Open up App.tsx to start working on your app!</Text>
    //   <StatusBar style="auto" /> */}
    // </View>

    // <Provider store = {store}>
    //   <ThemeProvider>
    //   <LoginFormProvider> 
    //       <LoginForm/>
    //   </LoginFormProvider> 
    // </ThemeProvider>  
    // </Provider>



    <SafeAreaProvider>

    
    <Provider store={store}>
    
      <ThemeProvider>
      {/* <LoginFormProvider> */}
        <Navigator />
      {/* </LoginFormProvider> */}
       
      </ThemeProvider>
  
    </Provider>
    </SafeAreaProvider>

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
