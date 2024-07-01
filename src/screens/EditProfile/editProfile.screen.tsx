import React, { useState } from "react";
import { ScrollView, SafeAreaView, StyleSheet, View, TouchableOpacity, Image, Modal, Text } from "react-native";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import { Button } from "../../components/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useDeleteUserMutation, useEditUserMutation, useGetUserByUsernameQuery, useResetPasswordMutation } from "../../services/user-interaction.service";
import { ProfileStackParamList } from "../ProfileNavigator/navigator.types";
import { TextInput } from "../../components/text-input";
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getStorage } from "firebase/storage";
import uuid from 'react-native-uuid';
import { UserPictureComponent } from "../../components/user-profile-picture/user-profile-picture.component";
import { setValue } from "../../store/profilePhoto.slice";
import { updateToken } from "../../store/tokenSlice";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UserResetPassProps } from "../../services/types";

type ProfileEditProps = NativeStackScreenProps<ProfileStackParamList, "EditProfile">;

const EditProfile = ({ route, navigation }: ProfileEditProps) => {
  const { userId } = route.params;
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.userData.username);
  const token = useSelector((state: RootState) => state.userData.token);
  const loggedId = useSelector((state: RootState) => state.userData.loggedId);

  const { data: userData, refetch: refetchUserData } = useGetUserByUsernameQuery(username);
  const { theme } = useThemeConsumer();
  const [selectedCollectionImageUri, setSelectedCollectionImageUri] = useState<string | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const [formData, setFormData] = useState({
    nume: userData?.nume || '',
    prenume: userData?.prenume || '',
    username: userData?.username || '',
    parola: userData?.parola || '',
    email: userData?.email || '',
    taraOrigine: userData?.taraOrigine || '',
    telefon: userData?.telefon || '',
    pozaProfil: userData?.pozaProfil || '',
  });

  const [editUser, { isSuccess: editUserSuccess }] = useEditUserMutation();
  const [deleteUser, { isSuccess: deleteUserSuccess }] = useDeleteUserMutation();
  const [resetPassword, { isSuccess: resetPasswordSuccess }] = useResetPasswordMutation();

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLogout = () => {
    dispatch(updateToken(""))
  }

  const handleDeleteAccount = async () => {
    const userProps = {
      id: loggedId,
      token
    };

    try {
      const response: { data?: { id: string }; error?: any } = await deleteUser(userProps);
      if (response && response.data && response.data.id) {
        console.log("Deleted successfully: ", response);
      }
    } catch (error) {
      console.log("Error deleting account: ", error);
    }
    dispatch(updateToken(""))
  }

  const handlePassReset = async () => {
    const userProps: UserResetPassProps = {
      username,
      newPassword,
      oldPassword
    };

    try {
      const response: { data?: { id: string }; error?: any } = await resetPassword(userProps);
      if (response && response.data && response.data.id) {
        console.log("reset pass successfully: ", response);
      }
    } catch (error) {
      console.log("Error reseting pass account: ", error);
    }
    dispatch(updateToken(""))
  }


  const uploadImageAsync = async (uri: string) => {
    const blob: Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const imgPath = `${username}/profile_image.jpg`;
    const fileRef = ref(getStorage(), imgPath);

    try {
      const metadata = {
        contentType: 'image/jpeg'
      };

      const result = await uploadBytesResumable(fileRef, blob, metadata);
      dispatch(setValue(imgPath));
      return await getDownloadURL(fileRef);

    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  const addCollectionPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setSelectedCollectionImageUri(selectedUri);
    }
  };

  const handleSave = async () => {
    const userProps = {
      user: formData,
      id: loggedId.toString(),
      token
    };

    try {
      if (selectedCollectionImageUri) {
        await uploadImageAsync(selectedCollectionImageUri);
      }

      const response: { data?: { id: string }; error?: any } = await editUser(userProps);
      if (response && response.data && response.data.id) {
        console.log("Successfully edited: ", response);
      }
    } catch (error) {
      console.log("Error editing user: ", error);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={addCollectionPhoto}>
              {selectedCollectionImageUri ? (
                <Image
                  source={{ uri: selectedCollectionImageUri }}
                  style={styles.image}
                />
              ) : (
                <UserPictureComponent photoPath={userData?.pozaProfil || ''} />
              )}
            </TouchableOpacity>
          </View>
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
          <View style={styles.buttonContainerSpecial}>
            <View>
              <Button title="Save Changes" onPress={handleSave} />
            </View>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.footerButtons}>
          <View style={styles.buttonContainer}>
            <Button sx={{ backgroundColor: 'pink' }} title="Reset Password" onPress={handleSave} />
          </View>
          <View style={styles.buttonContainer}>
            <Button sx={{ backgroundColor: 'pink' }} title="Logout" onPress={handleLogout} />
          </View>
          <View style={styles.buttonContainer}>
            <Button sx={{ backgroundColor: theme.colors.cardTitle }} title="Delete Account" onPress={() => setIsDeleteModalVisible(true)} />
          </View>
        </View>
      </ScrollView>

      {/* Modal for deleting account */}
      <Modal visible={isDeleteModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContentRecipe}>
            <Text style={{ marginBottom: 15, justifyContent: 'center', fontSize: 18, color: theme.colors.cardTitle }}>
              Are you sure you want to delete this account? This action is irreversible.
            </Text>
            <View style={styles.modalButtons}>
              <Button sx={{ margin: 10 }} variant="primary" onPress={() => setIsDeleteModalVisible(false)} title="Cancel" />
              <Button sx={{ margin: 10 }} variant="primary" onPress={handleDeleteAccount} title="Yes" />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eafafa',
  },
  contentContainer: {},
  formContainer: {
    backgroundColor: '#F5EEF8',
    borderRadius: 10,
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
  buttonContainerSpecial: {
    marginTop: 5,
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
  },
  footerButtons: {
    padding: 10,
  },
  image: {
    borderRadius: 60,
    height: 110,
    width: 110,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentRecipe: {
    backgroundColor: "#ffe6e6",
    padding: 30,
    borderRadius: 10,
    width: '90%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
});

export default EditProfile;
