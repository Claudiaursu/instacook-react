import { getDownloadURL, ref } from 'firebase/storage';
import {
  TextInput as NativeTextInput,
  TextInputProps as NativeTextInputProps,
  StyleSheet
} from "react-native";
import { View, FlatList, Dimensions } from 'react-native';
import { useEffect, useState } from "react";
import { useThemeConsumer } from '../../utils/theme/theme.consumer';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState, store } from '../../store/store';
import React from 'react';
import { TextInput } from '../text-input';
import { UserDto, useGetUsersBySearchQuery } from '../../services/user-interaction.service';
import { SearchedUserComponent } from '../searched-user/searched-user.component';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SearchStackParamList } from '../../screens/Search/navigator.types';

type SearchComponentProps = NativeStackScreenProps<SearchStackParamList, "SearchUser">;

export const SearchComponent = ({navigation}: SearchComponentProps) => {
  
  const loggedId = useSelector((state: RootState) => state.userData.loggedId);
  const token = useSelector((state: RootState) => state.userData.token); 
  const [query, setQuery] = useState("");

  let [filteredUsers2, setFilteredUsers2] = useState<UserDto[]>([]);

  let { data: filteredUsers, error, isLoading } = useGetUsersBySearchQuery(query);

  useEffect(() => {

    if (query.length === 0) {
      setFilteredUsers2([]);
    } else {
      const filtered = filteredUsers ?.filter(user => parseInt(user.id) != loggedId)
      setFilteredUsers2(filtered || [])
    }
    
  }, [query])

  const {
    theme,
    activeScheme,
    toggleThemeSchema
  } = useThemeConsumer();


    const handleSearch = (searchQuery: string) => {
      setQuery(searchQuery)
      console.log("din handleSearch", searchQuery);
    }

    const renderItem = ({ item }: { item: UserDto }) => {
      return <SearchedUserComponent user={item} onPress={() => handleUserRedirect(item.id)}/>
    };

    const handleUserRedirect = (userId: string) => {
      navigation.navigate('ProfileUser', {
        userId: userId
      });
    }
  
    return (
     
      <Provider store={store}> 
      
      <View>

      <View style= {{ margin: '2%' }}>
      <TextInput
        placeholder="Search..."
        value={query}
        label=""
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={handleSearch}
      />
      </View>

      <FlatList
        data={filteredUsers2 as UserDto[] | undefined}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    
    </View>
               
    </Provider>
  )

};

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;

const styles = (activeSchema: string) => {
  return StyleSheet.create({
      picture: {
          height: 225,
          width: 225,
          backgroundColor: activeSchema == 'light' ? "#ccccff": "#b82e8a",
          padding: 10,
          borderRadius: 8,
          borderWidth: 3,
          margin: 10,
          borderColor: activeSchema == 'light' ? "#cce6ff": "#8f246b"
        }
  });
    
}