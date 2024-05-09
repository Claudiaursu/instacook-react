import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Text } from '../text';
import { CollectionDto } from '../../services/collection.service';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../utils/firebase/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useThemeConsumer } from '../../utils/theme/theme.consumer';
import { Button } from '../button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RecipeDto } from '../../services/recipe.service';

export const RecipeCardComponent = (
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
    toggleThemeSchema,
    activeScheme
  } = useThemeConsumer();

  return (
    <View style={[styles.card, styles.cardContainer]}>
      <View style={{ alignItems: "center" }}>
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

      {!isOwner ? 
        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            onPress={() => {
              // Handle edit button press
            }}
            title="Like"
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
const deviceWidth = width;
const marginLeftRight = deviceWidth * 0.018; // Adjust this to change the overall margin
const cardWidth = (deviceWidth - 2 * marginLeftRight - marginLeftRight * 2) / 2; // Calculate card width for two columns

const styles = StyleSheet.create({
  cardContainer: {
    marginLeft: marginLeftRight,
    marginRight: marginLeftRight,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffe6e6',
    padding: 10,
    borderRadius: 8,
    width: cardWidth,
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

export default RecipeCardComponent;
