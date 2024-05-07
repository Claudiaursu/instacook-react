import React from 'react';
import { View, FlatList, Dimensions, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { RecipeDto, useGetRecipesByUserIdQuery } from '../../services/recipe.service';
import RecipeComponent from '../recipe/recipe.component';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabViewProfileParamList } from '../tab-view-profile/tab-view-profile.types';

type RecipeListProps = NativeStackScreenProps<TabViewProfileParamList, "Recipes">;

const RecipeList = ({  route, navigation }: {  route: any; navigation: RecipeListProps; }) => {
  const loggedId = useSelector((state: RootState) => state.userData.loggedId);
  const token = useSelector((state: RootState) => state.userData.token);
  const { userId } = route.params;

  const { data, error, isLoading } = useGetRecipesByUserIdQuery({ id: userId, token });

  const renderItem = ({ item }: { item: RecipeDto }) => {
    let isOwner = false;
    if (loggedId === userId) {
      isOwner = true;
    }
    return <RecipeComponent recipe={item} isOwner={isOwner}/>
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Display two columns
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listContainer: {
    justifyContent: 'space-between',
  },
});

export default RecipeList;
