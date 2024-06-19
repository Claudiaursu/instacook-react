import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ScrollView, SafeAreaView, StyleSheet, View } from "react-native";
import { RootStackParamList } from "../../navigation/navigator.types";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import { Button } from "../../components/button";
import { Text } from "../../components/text";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useGetUserByUsernameQuery } from "../../services/user-interaction.service";
import { ProfileStackParamList } from "../ProfileNavigator/navigator.types";
import { TextInput } from "../../components/text-input";

type ProfileEditProps = NativeStackScreenProps<ProfileStackParamList, "EditProfile">;

const EditProfile = ({ route, navigation }: ProfileEditProps) => {
  const { userId } = route.params;
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.userData.username);
  const token = useSelector((state: RootState) => state.userData.token);

  const { data: userData, refetch: refetchUserData } = useGetUserByUsernameQuery(username);
  const { theme } = useThemeConsumer();

  const [formData, setFormData] = useState({
    nume: userData?.nume || '',
    prenume: userData?.prenume || '',
    username: userData?.username || '',
    parola: userData?.parola || '',
    email: userData?.email || '',
    taraOrigine: userData?.taraOrigine || '',
    telefon: userData?.telefon || '',
  });

  const handleInputChange = (field: any, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    //dispatch(updateUserProfile({ ...formData, token }));
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formGroup}>
          <TextInput
            label="Last Name"
            value={formData.nume}
            onChangeText={(text) => handleInputChange('nume', text)}
          />
        </View>
        <View style={styles.formGroup}>
          <TextInput
            label="First name"
            value={formData.prenume}
            onChangeText={(text) => handleInputChange('prenume', text)}
          />
        </View>
        <View style={styles.formGroup}>
          <TextInput
            label="Username"
            value={formData.username}
            onChangeText={(text) => handleInputChange('username', text)}
          />
        </View>
        <View style={styles.formGroup}>
          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
          />
        </View>
        <View style={styles.formGroup}>
          <TextInput
            label="Country"
            value={formData.taraOrigine}
            onChangeText={(text) => handleInputChange('taraOrigine', text)}
          />
        </View>
        <View style={styles.formGroup}>
          <TextInput
            label="Phone"
            value={formData.telefon}
            onChangeText={(text) => handleInputChange('telefon', text)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Save Changes" onPress={handleSave} />
        </View>
        <View style={styles.buttonContainer}>
          <Button sx = {{backgroundColor: theme.colors.background2}} title="Reset Password" onPress={handleSave} />
        </View>
        <View style={styles.buttonContainer}>
          <Button sx = {{backgroundColor: theme.colors.cardTitle}} title="Delete account" onPress={handleSave} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eafafa',
  },
  contentContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default EditProfile;
