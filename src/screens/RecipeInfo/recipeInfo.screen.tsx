import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList, Image, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
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
  const loggedId = useSelector((state: RootState) => state.userData.loggedId);
  const token = useSelector((state: RootState) => state.userData.token);

  const { recipeId } = route.params;
  const recipeParams = {
    id: parseInt(recipeId),
    token: token
  };
  const { data: recipeData, error, isLoading, refetch } = useGetRecipeByIdQuery(recipeParams);
  const [imageUrl, setImageUrl] = useState('');
  const [isLikedByLoggedUser, setIsLikedByLoggedUser] = useState(false);

  const [likesCount, setLikesCount] = useState(recipeData?.reactii.length || 0);

  function changeReaction() {
    console.log("ID user logat ", loggedId); 
    console.log("ID reteta ", recipeId); 
    if (isLikedByLoggedUser) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setIsLikedByLoggedUser(!isLikedByLoggedUser);
  }

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

    const loggedUserReact = recipeData?.reactii.some((react) => react.utilizator.id === loggedId.toString());
    setIsLikedByLoggedUser(loggedUserReact ? true : false);
    setLikesCount(recipeData?.reactii.length || 0);
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
                  <TouchableOpacity onPress={changeReaction}>
                    {isLikedByLoggedUser ? (
                      <MaterialCommunityIcons name="heart" size={30} color={theme.colors.primary} />
                    ) : (
                      <MaterialCommunityIcons name="heart-outline" size={30} color={theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                  <Text sx={styles.socialText}>{likesCount}</Text>
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
              renderItem={({ item }) => (
                <View style={styles.ingredientItem}>
                  <MaterialCommunityIcons name="circle-medium" size={20} color="pink" />
                  <Text sx={styles.ingredientText}>{item}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <Text sx={styles.info}>Instructions:</Text>
            <ScrollView>
              <Text sx={styles.instructions}>{recipeData.instructiuni}</Text>
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EEF8",
  },
  imageContainer: {
    alignItems: "center",
    backgroundColor: "#d6f5f5",
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
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ingredientText: {
    fontSize: 14,
    color: "pink",
    marginLeft: 8,
  },
  instructions: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
});

export default RecipeInfo;
