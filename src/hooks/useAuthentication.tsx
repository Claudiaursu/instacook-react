// import { useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const useAsyncStorageListener = (key: string) => {
//     const [value, setValue] = useState<string>("");

//     useEffect(() => {
//         const handleAsyncStorageChange = async () => {
//             try {
//                 const newValue = await AsyncStorage.getItem(key) ?? '';
//                 setValue(newValue);
//             } catch (error) {
//                 console.error('Error reading AsyncStorage:', error);
//             }
//         };

//         const subscribeToChanges = async () => {
//             await handleAsyncStorageChange(); // Initial value

//             // Subscribe to changes
//             AsyncStorage.addListener(key, handleAsyncStorageChange);
//         };

//         subscribeToChanges();

//         return () => {
//             // Unsubscribe from changes when the component is unmounted
//             AsyncStorage.removeListener(key, handleAsyncStorageChange);
//         };
//     }, [key]);

//     return { value };
// };
