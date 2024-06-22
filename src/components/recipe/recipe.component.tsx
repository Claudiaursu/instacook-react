import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { Text } from '../../components/text';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../utils/firebase/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useThemeConsumer } from '../../utils/theme/theme.consumer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RecipeDto } from '../../services/types';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useDeleteRecipeByIdMutation } from '../../services/recipe.service';
import { Button } from '../button'; // Ensure you have this import

export const RecipeComponent = (
  { 
    recipe, 
    isOwner,
    handleDeleteUpdates 
  }: 
  { recipe: RecipeDto, 
    isOwner: boolean,
    handleDeleteUpdates: any 
  },
) => {
  
  const navigation = useNavigation();
  const recipeDate = new Date(recipe.createdAt);
  const username = useSelector((state: RootState) => state.userData.username);
  const token = useSelector((state: RootState) => state.userData.token);

  const [imageUrl, setImageUrl] = useState('');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteRecipenById, { isSuccess: deleteRecipeSuccess }] = useDeleteRecipeByIdMutation();

  useEffect(() => {
    const getPicture = async () => {
      const path = recipe.calePoza;
      if (path) {
        const imgRef = ref(storage, path);
        const imgUrl = await getDownloadURL(imgRef);
        setImageUrl(imgUrl);
        console.log("IMAGINE RETETA ", imgUrl)
      }
    };

    getPicture();
  }, [recipe.id, username]);

  const {
    theme,
    activeScheme
  } = useThemeConsumer(); 

  const handleRedirect = () => {
    navigation.dispatch(CommonActions.navigate({ name: 'RecipeInfo', params: { recipeId: recipe.id } }));
  }

  const deleteRecipe = async () => {
    const recipeDeleteParams = { id: recipe.id, token };
    try {
      await deleteRecipenById(recipeDeleteParams);
      handleDeleteUpdates(recipe.id);
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.log("ERROR ", error);
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => handleRedirect()}>
        <View style={{ alignItems: "center", backgroundColor: theme.colors.background2 }}>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
            />
          )}

          {!imageUrl && (
            <MaterialCommunityIcons
              name="chef-hat"
              size={50}
              color={theme.colors.primary}
            />
          )}
        </View>
      </TouchableOpacity>

      <View style={{backgroundColor: theme.colors.background2}}>
        <Text variant="subtitle" sx={styles.title}>{recipe.titluReteta}</Text>
      </View>
      {isOwner && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => {
            // Handle edit button press
          }}>
            <MaterialCommunityIcons name="pencil-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsDeleteModalVisible(true)}>
            <MaterialCommunityIcons name="delete-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={isDeleteModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContentRecipe}>
            <Text variant="title" sx={{ marginBottom: 15, justifyContent: 'center', fontSize: 18, color: theme.colors.cardTitle }}>
              Are you sure you want to delete recipe {recipe.titluReteta}?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Button sx={{ margin: 10 }} variant="primary" onPress={() => setIsDeleteModalVisible(false)} title="No" />
              <Button sx={{ margin: 10 }} variant="primary" onPress={deleteRecipe} title="Yes" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // Adjusted for padding and spacing

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5EEF8',
    borderRadius: 8,
    width: cardWidth,
    marginBottom: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    borderRadius: 8,
    height: 150,
    width: '100%',
  },
  title: {
    marginVertical: 8,
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 8,
    marginBottom: 4,
    marginTop: 4
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentRecipe: {
    backgroundColor:"#ffe6e6",
    padding: 30,
    borderRadius: 10,
    width: '90%',
    height: '25%', 
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecipeComponent;
