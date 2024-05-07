import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Button } from "../../components/button";
import { Text } from "../../components/text";
import { useGetUserByIdQuery } from "../../services/user-interaction.service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TabViewProfile } from "../../components/tab-view-profile/tab-view-profile.component";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SearchStackParamList } from "../Search/navigator.types";
import { UserPictureComponent } from "../../components/user-profile-picture/user-profile-picture.component";
import { useGetRecipesByUserIdQuery } from "../../services/recipe.service";
import { useFollowUserMutation, useGetFollowStatusQuery, useUnfollowUserMutation } from "../../services/following.service";

type UserProfileProps = NativeStackScreenProps<SearchStackParamList, "ProfileUser">;
const Tab = createMaterialTopTabNavigator();

export const UserProfile = ({
  route,
  navigation,
}: {
  route: any;
  navigation: UserProfileProps;
}) => {
  
  const loggedId = useSelector((state: RootState) => state.userData.loggedId);
  const token = useSelector((state: RootState) => state.userData.token);
  const { userId } = route.params;
  
  const { data: followStatus, error: followStatusError, isLoading: followStatusLoading } = useGetFollowStatusQuery({
    source: loggedId,
    destination: userId,
    token,
  });
  const [followActionText, setFollowActionText] = useState("Follow");

  const dispatch = useDispatch();
  const {
    data: recipesData,
    error: recipesError,
    isLoading: recipesLoading,
  } = useGetRecipesByUserIdQuery({ id: userId, token });
  const recipeCount = recipesData ? recipesData.length : 0;

  const { data, error, isLoading } = useGetUserByIdQuery({
    id: userId,
    token
  });

  const [followUser, {isSuccess: followUserSuccess }] = useFollowUserMutation();
  const [unfollowUser, {isSuccess: unfollowUserSuccess }] = useUnfollowUserMutation();


  const changeFollowStatus = () => {
    const followingParams = {
      relation: {
        urmarit: {
          id: userId
        },
        urmaritor: {
          id: loggedId
        }
      },
      token
    }

    if (followStatus?.status) {
      unfollowUser(followingParams);
      setFollowActionText("Follow")
    } else {
      followUser(followingParams)
      setFollowActionText("Unfollow")
    }
  }


  useEffect(() => {
    if (!followStatusError && followStatus?.status) {
      setFollowActionText("Unfollow")
    }
    if (!followStatusError && !followStatus?.status) {
      setFollowActionText("Follow")
    }
    
  }, [data, followStatus]);

  const { theme, activeScheme, toggleThemeSchema } = useThemeConsumer();

  return (
    <View style={{ flex: 1 }}>
      {/* Detalii cont + Poza  */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: theme.colors.background2,
        }}
      >
        <View style={{ flex: 1, marginTop: 7, marginBottom: 7 }}>
          <View style={{ flexDirection: "row", margin: 5 }}>
            <MaterialCommunityIcons
              name="chef-hat"
              size={24}
              color={theme.colors.primary}
            />
            <Text
              sx={{
                textAlign: "left",
              }}
              variant="profileTitle"
            >
              {data?.username}
            </Text>
          </View>

          <Text
            sx={{
              margin: 5,
              textAlign: "left",
            }}
            variant="subtitle"
          >
            {" "}
            {data?.nume} {data?.prenume}
          </Text>

          <Text
            sx={{
              margin: 5,
              textAlign: "left",
            }}
            variant="subtitle"
          >
            {" "}
            {data?.email}
          </Text>

          <Text
            sx={{
              margin: 5,
              textAlign: "left",
            }}
            variant="subtitle"
          >
            {" "}
            {data?.taraOrigine}
          </Text>

          {/* Nr Retete + Followers + Follows  */}
          <View style={{ flexDirection: "row", marginTop: 7 }}>
            <View>
              <Text
                sx={{
                  margin: 5,
                  textAlign: "center",
                }}
                variant="subtitle"
              >
                {" "}
                Followers
              </Text>
              <Text
                sx={{
                  margin: 5,
                  textAlign: "center",
                }}
                variant="subtitle"
              >
                {" "}
                {data?.followers.length}
              </Text>
            </View>

            <View>
              <Text
                sx={{
                  margin: 5,
                  textAlign: "center",
                }}
                variant="subtitle"
              >
                {" "}
                Follows
              </Text>
              <Text
                sx={{
                  margin: 5,
                  textAlign: "center",
                }}
                variant="subtitle"
              >
                {" "}
                {data?.follows.length}
              </Text>
            </View>

            <View>
              <Text
                sx={{
                  margin: 5,
                  textAlign: "center",
                }}
                variant="subtitle"
              >
                {" "}
                Recipes
              </Text>
              <Text
                sx={{
                  margin: 5,
                  textAlign: "center",
                }}
                variant="subtitle"
              >
                {" "}
                {recipeCount}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 7 }}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <UserPictureComponent
              photoPath={data?.pozaProfil || "profile_images/default.png"}
            />
          </View>

          <View>
            <Button
              sx={{ margin: 10 }}
              variant="profile"
              onPress={changeFollowStatus}
              title={followActionText}
            />
          </View>
        </View>
      </View>

      <TabViewProfile userId={userId} refresh={1} />
    </View>
  );
};

const styles = () => {
  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: "#ffe6e6",
      padding: 20,
      borderRadius: 10,
      width: "80%",
    },
    input: {
      borderWidth: 1,
      borderColor: "#CCC",
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    container: {
      flexDirection: "row", // Set flexDirection to 'row' to place components next to each other horizontally
      alignItems: "center",
    },
  });
};

export default UserProfile;
