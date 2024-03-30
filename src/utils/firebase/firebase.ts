// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import Constants from 'expo-constants';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from 'firebase/storage';
import { firebase } from "@react-native-firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: Constants?.expoConfig?.extra?.firebase.apikey,
//   authDomain: Constants?.expoConfig?.extra?.firebase.authDomain,
//   projectId: Constants?.expoConfig?.extra?.firebase.projectId,
//   storageBucket: Constants?.expoConfig?.extra?.firebase.storageBucket,
//   messagingSenderId: Constants?.expoConfig?.extra?.firebase.messagingSenderId,
//   appId: Constants?.expoConfig?.extra?.firebase.appId
// };

const firebaseConfig = {
  apiKey: "AIzaSyDzoX4C6dCBwjtljv8PgaVuX5B63m2Fq8U",
  authDomain: "react-app-bf2ed.firebaseapp.com",
  projectId: "react-app-bf2ed",
  storageBucket: "react-app-bf2ed.appspot.com",
  messagingSenderId: "989435172909",
  appId: "1:989435172909:web:dfaceef50bae7024bec0a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);

export const storage = getStorage(app);

export default app;
