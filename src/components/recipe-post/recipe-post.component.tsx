import React, { useEffect, useRef, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "../../components/text";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../utils/firebase/firebase";
import { RecipeFeedDto } from "../../services/types";
import moment from "moment";
import * as Animatable from 'react-native-animatable';
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useLikeRecipeFromFeedMutation, useUnlikeRecipeMutation } from "../../services/reactions.service";

const RecipePost = ({ recipeData }: { recipeData: RecipeFeedDto }) => {
  const [recipeImageUrl, setRecipeImageUrl] = useState("");
  const [authorImageUrl, setAuthorImageUrl] = useState("");

  const loggedId = useSelector((state: RootState) => state.userData.loggedId);
  const token = useSelector((state: RootState) => state.userData.token);

  const [likesCount, setLikesCount] = useState(parseInt(recipeData?.nr_reactii) || 0);
  const [likeRecipe] = useLikeRecipeFromFeedMutation();
  const [unlikeRecipe] = useUnlikeRecipeMutation();

  const [isLikedByLoggedUser, setIsLikedByLoggedUser] = useState(false);
  const heartIconRef = useRef<Animatable.View & View>(null);
  const { theme } = useThemeConsumer();

  useEffect(() => {
    const getRecipePicture = async () => {
      const path = recipeData?.cale_poza;
      if (path) {
        const imgRef = ref(storage, path);
        const imgUrl = await getDownloadURL(imgRef);
        setRecipeImageUrl(imgUrl);
      }
    };
    const getAuthorPicture = async () => {
      const path = recipeData?.poza_profil;
      if (path) {
        const imgRef = ref(storage, path);
        const imgUrl = await getDownloadURL(imgRef);
        setAuthorImageUrl(imgUrl);
      }
    };
    getRecipePicture();
    getAuthorPicture();
  }, [recipeData]);

  function changeReaction() {
    if (heartIconRef && heartIconRef?.current?.bounceIn) {
      heartIconRef.current.bounceIn(700);
    }

    const likeParams = {
      like: {
        reteta: {
          id: recipeData.id
        },
        utilizator: {
          id: loggedId
        }
      },
      token
    }

    if (isLikedByLoggedUser) {
      setLikesCount(likesCount - 1);
      unlikeRecipe(likeParams);
    } else {
      setLikesCount(likesCount + 1);
      likeRecipe(likeParams);
    }
    setIsLikedByLoggedUser(!isLikedByLoggedUser);
  }

  const getTimeDifference = (createdAt: any) => {
    const now = moment();
    const createdTime = moment(createdAt);
    const diffSeconds = now.diff(createdTime, 'seconds');
    const diffMinutes = now.diff(createdTime, 'minutes');
    const diffHours = now.diff(createdTime, 'hours');
    const diffDays = now.diff(createdTime, 'days');
    const diffWeeks = now.diff(createdTime, 'weeks');

    if (diffSeconds < 60) {
      return `${diffSeconds} s ago`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} mins ago`;
    } else if (diffHours < 24) {
      return `${diffHours} h ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return `${diffWeeks} weeks ago`;
    }
  };

  return (
    <View style={styles.recipeContainer}>
      <View style={styles.recipeHeader}>
        <Image source={{ uri: authorImageUrl }} style={styles.profileImage} />
        <Text sx={styles.username}>{recipeData.username}</Text>
      </View>
      {recipeImageUrl && <Image source={{ uri: recipeImageUrl }} style={styles.recipeImage} />}
      <View style={styles.titleContainer}>
        <Text sx={styles.recipeTitle}>{recipeData.titlu_reteta}</Text>
        <Text sx={styles.timestamp}>{getTimeDifference(recipeData.created_at)}</Text>
      </View>
      <Text sx={styles.difficulty}>{recipeData.dificultate}</Text>
      <View style={styles.recipeFooter}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={changeReaction}>
            <Animatable.View ref={heartIconRef}>
              {isLikedByLoggedUser ? (
                <MaterialCommunityIcons name="heart" size={30} color={theme.colors.primary} />
              ) : (
                <MaterialCommunityIcons name="heart-outline" size={30} color={theme.colors.primary} />
              )}
            </Animatable.View>
          </TouchableOpacity>
          <Text sx={styles.reactionText}>{likesCount}</Text>
        </View>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="chat-outline" size={30} color={theme.colors.primary} />
          <Text sx={styles.reactionText}>{recipeData.nr_comentarii}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recipeContainer: {
    marginBottom: 20,
    backgroundColor: '#f9ecf2',
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  recipeImage: {
    width: '100%',
    height: 240,  // Adjusted to be closer to a square but not exactly
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    paddingTop: 5,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    flexWrap: 'wrap',
  },
  timestamp: {
    fontSize: 14,
    color: '#888',
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  difficulty: {
    fontSize: 14,
    color: '#666',
    paddingLeft: 10,
    paddingBottom: 10,
  },
  recipeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingTop: 5,
    justifyContent: 'space-around',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  reactionText: {
    marginLeft: 5,
  },
});

export default RecipePost;
