import React, { useEffect, useState } from 'react';
import { View, FlatList, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useGetRecipesByUserIdQuery } from '../../services/recipe.service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabViewProfileParamList } from '../tab-view-profile/tab-view-profile.types';
import { RecipeDto } from '../../services/types';
import { RecipeComponent } from '../recipe/recipe.component';

type RecipeListProps = NativeStackScreenProps<TabViewProfileParamList, "Recipes">;

const RecipeList = ({ route, navigation }: { route: any; navigation: RecipeListProps; }) => {
  const loggedId = useSelector((state: RootState) => state.userData.loggedId);
  const token = useSelector((state: RootState) => state.userData.token);
  const { userId } = route.params;
  
  const { data, error, isLoading, refetch } = useGetRecipesByUserIdQuery({ id: userId, token });
  const [recipeDataList, setRecipeDataList] = useState<RecipeDto[]>(data ? data : []);

  const renderItem = ({ item }: { item: RecipeDto }) => {
    let isOwner = false;
    if (loggedId === userId) {
      isOwner = true;
    }
    return <RecipeComponent recipe={item} isOwner={isOwner} handleDeleteUpdates={handleDeleteUpdates}/>
  };

  const handleDeleteUpdates = (recipeId: any) => {
    const newRecipeList = recipeDataList?.filter(recipe => recipe.id != recipeId);
    setRecipeDataList(newRecipeList);
  }

  useEffect(() => {
    if (data && data.length > 0) {
      setRecipeDataList(data);
    }
}, [data]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      <FlatList
        data={recipeDataList as RecipeDto[] | undefined}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} 
        contentContainerStyle={styles.listContainer}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  listContainer: {
    justifyContent: 'space-between',
  },
});

export default RecipeList;
