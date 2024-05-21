import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList, Image, View, StyleSheet } from "react-native";
import { RootStackParamList } from "../../navigation/navigator.types";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import { Text } from "../../components/text";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { storage } from "../../utils/firebase/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { useGetRecipeByIdQuery } from "../../services/recipe.service";
import { ProfileStackParamList } from "../ProfileNavigator/navigator.types";

type RecipeInfoProps = NativeStackScreenProps<ProfileStackParamList, "RecipeInfo">;

const RecipeInfo = ({ route, navigation }: RecipeInfoProps) => {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.userData.username);
  const loggedId = useSelector((state: RootState) => state.userData.loggedId);
  const token = useSelector((state: RootState) => state.userData.token);

  const { recipeId } = route.params;
  const recipeParams = {
    id: parseInt(recipeId),
    token: token
  };
  const { data: recipeData, error, isLoading, refetch } = useGetRecipeByIdQuery(recipeParams);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const getPicture = async () => {
      const path = recipeData?.calePoza;
      if (path) {
        const imgRef = ref(storage, path);
        const imgUrl = await getDownloadURL(imgRef);
        setImageUrl(imgUrl);
      }
    };
    getPicture();
  }, [recipeData]);

  const { theme } = useThemeConsumer();  

  return (
    <View style={styles.container}>
      {recipeData && (
        <>
          <View style={styles.imageContainer}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.image} />
            ) : (
              <MaterialCommunityIcons name="chef-hat" size={50} color={theme.colors.primary} />
            )}
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.titleZone}>
              <Text sx={styles.title}>{recipeData.titluReteta}</Text>
              <View style={styles.social}>
                <View style={styles.socialItem}>
                  <MaterialCommunityIcons name="heart-outline" size={30} color={theme.colors.primary} />
                  <Text sx={styles.socialText}>{recipeData.reactii.length}</Text>
                </View>
                <View style={styles.socialItem}>
                  <MaterialCommunityIcons name="chat-outline" size={30} color={theme.colors.primary} />
                  <Text sx={styles.socialText}>{recipeData.comentarii.length}</Text>
                </View>
              </View>
            </View>
            <Text sx={styles.info}>Difficulty: {recipeData.dificultate}</Text>
            <Text sx={styles.info}>Ingredients:</Text>
            <FlatList
              data={recipeData.ingrediente}
              renderItem={({ item }) => <Text sx={styles.item}>{item}</Text>}
              keyExtractor={(item, index) => index.toString()}
            />
            <Text sx={styles.info}>Instructions:</Text>
            <Text sx={styles.instructions}>{recipeData.instructiuni}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: "center",
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    resizeMode: "cover",
  },
  detailsContainer: {
    padding: 16,
  },
  titleZone: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#333',
  },
  social: {
    flexDirection: "row",
    alignItems: "center",
  },
  socialItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  socialText: {
    marginLeft: 6,
    fontWeight: '400',
    fontSize: 18,
  },
  info: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  item: {
    fontSize: 14,
    marginBottom: 4,
    paddingLeft: 16,
  },
  instructions: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
});

export default RecipeInfo;
