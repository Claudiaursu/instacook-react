import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { RootStackParamList } from "../../navigation/navigator.types";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import { View, ScrollView, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { Text } from "../../components/text";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useGetFeedFollowRecipesForUserQuery, useGetFeedRecipesForUserQuery } from "../../services/recipe.service";
import RecipePost from "../../components/recipe-post/recipe-post.component";
import { Button } from "../../components/button";
import { useCountUnseenNotificationsQuery } from "../../services/notifications";
import { updateunseenNotifications } from "../../store/notifications";

type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;

const Home = ({ navigation }: HomeProps) => {
  const dispatch = useDispatch();
  const loggedId = useSelector((state: RootState) => state.userData.loggedId);
  const token = useSelector((state: RootState) => state.userData.token);
  const username = useSelector((state: RootState) => state.userData.username);

  const userParams = { id: loggedId, token: token };
  
  const { data: notificationsData, refetch: refetchNotifications } = useCountUnseenNotificationsQuery(userParams, {
    skip: !loggedId || !token,
  });

  useEffect(() => {
    if (notificationsData) {
      const notifCount = notificationsData.count ?? 0;
      dispatch(updateunseenNotifications(notifCount));
    }
  }, [notificationsData]);

  const { 
    data: recipeFollowList, 
    error: recipefollowError, 
    isLoading: recipeFollowLoading, 
    refetch: refetchFollowRecipes, 
    isFetching: isFetchingFollowRecipes 
  } = useGetFeedFollowRecipesForUserQuery(userParams);

  const { 
    data: recipeExtraList, 
    error: recipeExtraError, 
    isLoading: recipeExtraLoading, 
    refetch: refetchExtraRecipes, 
    isFetching: isFetchingExtraRecipes
  } = useGetFeedRecipesForUserQuery(userParams);

  const {
      theme,
      activeScheme,
      toggleThemeSchema
  } = useThemeConsumer();

  const [extraRecipesVisible, setExtraRecipesVisible] = useState(false);

  const onRefresh = () => {
    refetchFollowRecipes();
    if (extraRecipesVisible) {
      refetchExtraRecipes();
    }
  };

  return (
    <ScrollView style={styles().wrapper}
      refreshControl={
        <RefreshControl 
          refreshing={recipeFollowLoading || (extraRecipesVisible && recipeExtraLoading)} 
          onRefresh={onRefresh} 
        />
      }
    >
      <View style={styles().container}>
        <Text sx={{ margin: 18, textAlign: 'center' }} variant="title">Hello {username}!</Text>

        {recipeFollowList && recipeFollowList.map((recipe) => (
          <RecipePost key={recipe.id} recipeData={recipe} />
        ))}

        {!extraRecipesVisible && (

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{  alignItems: 'center'}}>
          <Button sx={{margin: 1}}
          onPress={() => setExtraRecipesVisible(true) }
          title="Explore more recipes"/>
          </View>
          </View>
          
        )}

        {extraRecipesVisible && recipeExtraList && recipeExtraList.map((recipe) => (
          <RecipePost key={recipe.id} recipeData={recipe} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = () => {
  return StyleSheet.create({
    wrapper: {
      backgroundColor: "#F5EEF8",
    },
    container: {
      flex: 1,
      padding: 10,
    },
    exploreButton: {
      margin: 20,
      padding: 15,
      backgroundColor: 'pink',
      borderRadius: 10,
      alignItems: 'center',
    },
    // exploreButtonText: {
    //   color:
    //   fontSize: 16,
    // },
  });
}

export default Home;
