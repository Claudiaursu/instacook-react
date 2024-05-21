import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { Text } from '../text';
import { CollectionDto } from '../../services/collection.service';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../utils/firebase/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useThemeConsumer } from '../../utils/theme/theme.consumer';
import { Button } from '../button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { RecipeSummaryDto } from '../../services/recipe.service';

export const RecipeCardComponent = (
  { recipe, isOwner }: { recipe: RecipeSummaryDto, isOwner: boolean },
) => {
  const navigation = useNavigation();

  console.log("recipe ", recipe)
  const recipeDate = new Date(recipe.createdat);
  const username = useSelector((state: RootState) => state.userData.username);

  const [imageUrl, setImageUrl] = useState('');

  const handleRedirect = () => {
    navigation.dispatch(CommonActions.navigate({ name: 'RecipeInfo', params: { recipeId: recipe.id } }));
  }

  useEffect(() => {
    const getPicture = async () => {
      const path = recipe.calepoza;
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
    <TouchableOpacity onPress={handleRedirect}>

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

      <View style={styles.socialIcon}>
        <View style ={{flexDirection: 'row',  alignItems: 'center', margin: 3}}>
          <Text sx= {{fontWeight: "500", marginRight: 10}}>{recipe.reactii}</Text>
          <MaterialCommunityIcons
            name="heart-outline"
            size={25}
            color={theme.colors.primary}
          />
        </View>

        <View style ={{flexDirection: 'row',  alignItems: 'center', margin: 3}}> 
          <Text sx= {{fontWeight: "500" , marginRight: 10}} >{recipe.comentarii}</Text>
          <MaterialCommunityIcons
            name="chat-outline"
            size={25}
            color={theme.colors.primary}
          />
        </View>
        
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
    </TouchableOpacity>
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
    backgroundColor: '#eafafa',
    paddingBottom: 5,
    borderRadius: 10,
    width: cardWidth,
  },
  image: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 150,
    width: '100%',
    marginBottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  socialIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20, // Adjust spacing between icons
    marginTop: 5,
  }
});

export default RecipeCardComponent;
