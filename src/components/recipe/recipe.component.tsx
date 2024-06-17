import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from '../../components/text';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../utils/firebase/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useThemeConsumer } from '../../utils/theme/theme.consumer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RecipeDto } from '../../services/types';

export const RecipeComponent = (
  { recipe, isOwner }: { recipe: RecipeDto, isOwner: boolean },
) => {
  
  const recipeDate = new Date(recipe.createdAt);
  const username = useSelector((state: RootState) => state.userData.username);

  const [imageUrl, setImageUrl] = useState('');

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

  return (
    <View style={styles.card}>
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
          <TouchableOpacity onPress={() => {
            // Handle delete button press
          }}>
            <MaterialCommunityIcons name="delete-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      )}
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
});

export default RecipeComponent;
