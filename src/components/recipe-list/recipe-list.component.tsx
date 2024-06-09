import React from 'react';
import { View, FlatList, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useGetRecipesByUserIdQuery } from '../../services/recipe.service';
import RecipeComponent from '../recipe/recipe.component';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabViewProfileParamList } from '../tab-view-profile/tab-view-profile.types';
import { RecipeDto } from '../../services/types';

type RecipeListProps = NativeStackScreenProps<TabViewProfileParamList, "Recipes">;

const RecipeList = ({ route, navigation }: { route: any; navigation: RecipeListProps; }) => {
  const loggedId = useSelector((state: RootState) => state.userData.loggedId);
  const token = useSelector((state: RootState) => state.userData.token);
  const { userId } = route.params;

  const { data, error, isLoading, refetch } = useGetRecipesByUserIdQuery({ id: userId, token });

  const renderItem = ({ item }: { item: RecipeDto }) => {
    let isOwner = false;
    if (loggedId === userId) {
      isOwner = true;
    }
    return <RecipeComponent recipe={item} isOwner={isOwner} />
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Display two columns
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
