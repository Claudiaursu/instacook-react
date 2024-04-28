import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Text } from '../../components/text';
import { CollectionDto } from '../../services/collection.service';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../utils/firebase/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useThemeConsumer } from '../../utils/theme/theme.consumer';
import { Button } from '../button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RecipeDto } from '../../services/recipe.service';

export const RecipeComponent = (
  { recipe, isOwner }: { recipe: RecipeDto, isOwner: boolean },
  ) => {
  
  const recipeDate = new Date(recipe.createdAt);
  const username = useSelector((state: RootState) => state.userData.username);

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const getPicture = async () => {
      const path = `${username}/recipes/${recipe.id}.png`;
      const imgRef = ref(storage, path);
      const imgUrl = await getDownloadURL(imgRef);
      setImageUrl(imgUrl);
    };

    getPicture();
  }, [recipe.id, username]);

    const {
        theme,
        toggleThemeSchema,
        activeScheme
    } = useThemeConsumer();

    return (
      <View style={styles.card}>
        <Text variant="subtitle">{recipe.titluReteta}</Text>
        <Image source={{ uri: imageUrl }} style={styles.image} />
  
        {isOwner ? 
        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            onPress={() => {
              // Handle edit button press
            }}
            title="Edit"
          />
          <Button
            variant="primary"
            onPress={() => {
              // Handle delete button press
            }}
            title="Delete"
          />
        </View>
      : null}

      </View>
    );
  };
  
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 48) / 2; // Calculate card width for two columns
  
  const styles = StyleSheet.create({
    card: {
      backgroundColor: '#ffe6e6',
      padding: 10,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#8f246b',
      width: cardWidth,
      marginBottom: 16,
    },
    image: {
      borderRadius: 10,
      height: 150,
      width: '100%',
      marginBottom: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
  });
  
  export default RecipeComponent;