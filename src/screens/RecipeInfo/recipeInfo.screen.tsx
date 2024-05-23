import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { FlatList, Image, View, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, RefreshControl, ActivityIndicator } from "react-native";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import { Text } from "../../components/text";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { storage } from "../../utils/firebase/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { useGetRecipeByIdQuery } from "../../services/recipe.service";
import { ProfileStackParamList } from "../ProfileNavigator/navigator.types";
import { useLikeRecipeMutation, useUnlikeRecipeMutation } from '../../services/reactions.service';
import * as Animatable from 'react-native-animatable';
import { useAddRecipeCommentMutation, useDeleteRecipeCommentMutation, useUpdateRecipeCommentMutation } from "../../services/comments.service";

type RecipeInfoProps = NativeStackScreenProps<ProfileStackParamList, "RecipeInfo">;

const RecipeInfo = ({ route, navigation }: RecipeInfoProps) => {
  const dispatch = useDispatch();
  const loggedId = useSelector((state: RootState) => state.userData.loggedId);
  const token = useSelector((state: RootState) => state.userData.token);
  
  const [likeRecipe, { isSuccess: likeRecipeSuccess }] = useLikeRecipeMutation();
  const [unlikeRecipe, { isSuccess: unlikeRecipeSuccess }] = useUnlikeRecipeMutation();
  const [addComment, { isSuccess: addCommentSuccess }] = useAddRecipeCommentMutation();
  const [updateComment, { isSuccess: updateCommentSuccess }] = useUpdateRecipeCommentMutation();
  const [deleteComment, { isSuccess: deleteCommentSuccess }] = useDeleteRecipeCommentMutation();

  const { recipeId } = route.params;
  const recipeParams = {
    id: parseInt(recipeId),
    token: token
  };
  const { data: recipeData, error, isLoading, refetch, isFetching } = useGetRecipeByIdQuery(recipeParams);
  const [imageUrl, setImageUrl] = useState('');
  const [isLikedByLoggedUser, setIsLikedByLoggedUser] = useState(false);
  const [likesCount, setLikesCount] = useState(recipeData?.reactii.length || 0);
  const [showAllComments, setShowAllComments] = useState(false);
  const heartIconRef = useRef<Animatable.View & View>(null);
  const [commenterProfileImages, setCommenterProfileImages] = useState<{ [key: string]: string }>({});

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editCommentText, setEditCommentText] = useState('');
  const [currentComment, setCurrentComment] = useState<any>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  function changeReaction() {
    if (heartIconRef && heartIconRef?.current?.bounceIn) {
      heartIconRef.current.bounceIn(700);
    }

    const likeParams = {
      like: {
        reteta: {
          id: recipeId
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
    refetch();
    setIsLikedByLoggedUser(!isLikedByLoggedUser);
  }

  const getCommenterPicture = async (path: string) => {
    let imgUrl = "profile_images/default.png";
    if (path) {
      const imgRef = ref(storage, path);
      imgUrl = await getDownloadURL(imgRef);
    }
    return imgUrl;
  };

  /* modal logic */
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }

  const closeModal = () => {
    toggleModal();
    setCommentText("");
  }

  const handleCommentSubmit = () => {
    const commentParams = {
      comment: {
        reteta: {
          id: recipeId
        },
        utilizator: {
          id: loggedId
        },
        text: commentText
      },
      token
    }

    addComment(commentParams);
    closeModal();
  }

  const openEditModal = (comment: any) => {
    setCurrentComment(comment);
    console.log("current comment ", comment)
    setEditCommentText(comment.text);
    setIsEditModalVisible(true);
  }

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setCurrentComment(null);
    setEditCommentText('');
  }

  const handleEditSubmit = () => {
    const updateCommentParams = {
      comment: {
        text: editCommentText
      },
      token,
      commentId: currentComment.id
    }
    updateComment(updateCommentParams);
    closeEditModal();
  }

  const openDeleteModal = (comment: any) => {
    setCurrentComment(comment);
    setIsDeleteModalVisible(true);
  }

  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setCurrentComment(null);
  }

  const handleDeleteSubmit = () => {
    const deleteParams = {
      commentId: currentComment.id,
      token
    }

    deleteComment(deleteParams);
    closeDeleteModal();
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

    const fetchCommenterImages = async () => {
      const newCommenterProfileImages: any = {};
      for (const comment of recipeData?.comentarii || []) {
        const commenterProfileUri = await getCommenterPicture(comment?.utilizator?.pozaProfil);
        newCommenterProfileImages[comment.id] = commenterProfileUri;
      }
      setCommenterProfileImages(newCommenterProfileImages);
    };

    fetchCommenterImages();
  }, [recipeData]);

  const { theme } = useThemeConsumer();

  const renderComment = (comment: any) => {
    const commenterProfileUri = commenterProfileImages[comment.id];

    return (
      <View key={comment.id} style={styles.commentContainer}>
        <Image source={{ uri: commenterProfileUri }} style={styles.profileImage} />
        <View style={styles.commentTextContainer}>
          <Text sx={styles.commentUsername}>{comment.utilizator.username}</Text>
          <Text sx={styles.commentText}>{comment.text}</Text>
        </View>
        {comment.utilizator.id === loggedId.toString() && (
          <>
            <TouchableOpacity onPress={() => openEditModal(comment)} style={styles.iconButton}>
              <MaterialCommunityIcons name="pencil-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openDeleteModal(comment)} style={styles.iconButton}>
              <MaterialCommunityIcons name="delete-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <ScrollView style={styles.container}
    refreshControl={
      <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
    }
    >
      {recipeData && (
        <>
          <View style={{backgroundColor: "#d6f5f5"}}>
            <View style={styles.imageContainer}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.image} />
              ) : (
                <MaterialCommunityIcons name="chef-hat" size={50} color={theme.colors.primary} />
              )}
               {isFetching && (
                <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loadingSpinner} />
              )}
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.titleZone}>
              <View style={styles.titleContainer}>
                <Text sx={styles.title}>{recipeData.titluReteta}</Text>
              </View>
              <View style={styles.social}>
                <View style={styles.socialItem}>
                  <TouchableOpacity onPress={changeReaction}>
                    <Animatable.View ref={heartIconRef}>
                      {isLikedByLoggedUser ? (
                        <MaterialCommunityIcons name="heart" size={30} color={theme.colors.primary} />
                      ) : (
                        <MaterialCommunityIcons name="heart-outline" size={30} color={theme.colors.primary} />
                      )}
                    </Animatable.View>
                  </TouchableOpacity>
                  <Text sx={styles.socialText}>{likesCount}</Text>
                </View>

                <View style={styles.socialItem}>
                  <TouchableOpacity onPress={toggleModal}>
                    <MaterialCommunityIcons name="chat-outline" size={30} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <Modal visible={isModalVisible} animationType="slide" transparent>
                    <View style={styles.modalContainer}>
                      <View style={styles.modalContent}>
                        <Text sx={styles.modalTitle}>Add Comment</Text>
                        <TextInput
                          style={styles.commentInput}
                          multiline
                          numberOfLines={4}
                          value={commentText}
                          onChangeText={setCommentText}
                          placeholder="Write your comment here..."
                        />
                        <TouchableOpacity style={styles.submitButton} onPress={handleCommentSubmit}>
                          <Text sx={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                          <Text sx={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
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
            <Text sx={styles.instructions}>{recipeData.instructiuni}</Text>

            <View style={styles.commentsSection}>
              <Text sx={styles.commentsTitle}>Comments</Text>
              {recipeData.comentarii.length > 0 ? (
                <>
                  {renderComment(recipeData.comentarii[0])}
                  {!showAllComments && recipeData.comentarii.length > 1 && (
                    <TouchableOpacity onPress={() => setShowAllComments(true)}>
                      <Text sx={styles.seeMoreText}>See more comments</Text>
                    </TouchableOpacity>
                  )}
                  {showAllComments && (
                    <FlatList
                      data={recipeData.comentarii.slice(1)}
                      renderItem={({ item }) => renderComment(item)}
                      keyExtractor={(item) => item.id.toString()}
                      ListEmptyComponent={<Text sx={styles.noCommentsText}>No comments yet</Text>}
                    />
                  )}
                </>
              ) : (
                <Text sx={styles.noCommentsText}>No comments yet</Text>
              )}
            </View>
          </View>
        </>
      )}
      {/* Edit Comment Modal */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text sx={styles.modalTitle}>Edit Comment</Text>
            <TextInput
              style={styles.commentInput}
              multiline
              numberOfLines={4}
              value={editCommentText}
              onChangeText={setEditCommentText}
              placeholder="Edit your comment here..."
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleEditSubmit}>
              <Text sx={styles.submitButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={closeEditModal}>
              <Text sx={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal visible={isDeleteModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text sx={styles.modalTitle}>Confirm Delete</Text>
            <Text>Are you sure you want to delete this comment?</Text>
            <TouchableOpacity style={styles.submitButton} onPress={handleDeleteSubmit}>
              <Text sx={styles.submitButtonText}>Yes, delete it</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={closeDeleteModal}>
              <Text sx={styles.closeButtonText}>No, keep it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
    borderRadius: 16,
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
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#333',
  },
  social: {
    flexDirection: "row",
    alignItems: "center"
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
  commentsSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUsername: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  commentText: {
    color: '#555',
  },
  iconButton: {
    marginLeft: 5,
  },
  seeMoreText: {
    color: '#007BFF',
    marginTop: 10,
  },
  noCommentsText: {
    color: '#555',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#F5EEF8",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: 'pink',
    alignSelf: 'center'
  },
  commentInput: {
    height: 100,
    borderColor: "transparent",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#F5EEF8",
    fontSize: 16,
    color: "#333333",
  },
  submitButton: {
    backgroundColor: "#ffb3b3",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#bf4080",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingSpinner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
  },
});

export default RecipeInfo;
