import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from '../../components/text';
import { CollectionDto } from '../../services/collection.service';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../utils/firebase/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useThemeConsumer } from '../../utils/theme/theme.consumer';
import { Button } from '../button';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const CollectionComponent = ({ collection }: { collection: CollectionDto }) => {
  const collectionDate = new Date(collection.createdAt);
  const username = useSelector((state: RootState) => state.userData.username);

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const getPicture = async () => {
      const path = `${username}/collections/${collection.id}.png`;
      const imgRef = ref(storage, path);
      const imgUrl = await getDownloadURL(imgRef);
      setImageUrl(imgUrl);
    };

    getPicture();
  }, [collection.id, username]);

    const {
        theme,
        toggleThemeSchema,
        activeScheme
    } = useThemeConsumer();

  return (
    <View style={styles(activeScheme).container}>
      <View style={styles(activeScheme).card}>
        <Text variant="subtitle">{collection.titluColectie}</Text>
        
        <View style={styles(activeScheme).contentContainer}>
          {/* Image */}
          <View style = {{ alignItems: 'center'}}>
          <Image source={{ uri: imageUrl }} style={styles(activeScheme).image} />
          </View>

          <View style={styles(activeScheme).textContainer}>
            <Text variant="technicalText" numberOfLines={5} sx = {{ marginBottom: 5 }}>
              {collection.descriereColectie}
            </Text>
            <Text variant="technicalText" sx = {{ marginBottom: 5 }}>
              Created at: {collectionDate.toLocaleString()}
            </Text>

            <Text variant="technicalText" sx = {{ marginBottom: 5 }}>
              Recipes: 0
            </Text>
          </View>
        </View>

        <View>
            <View>
                <Button 
                    sx={{margin: 10}}
                    variant="primary"
                    onPress = { () => {} } 
                    title="Edit"/> 
            </View>
            <View>

            {/* <MaterialCommunityIcons name="trash-outline" size={24} color={theme.colors.primary} /> */}

            <Button 
            
                sx={{margin: 10}}
                variant="primary"
                onPress = { () => {} } 
                title="Delete"/> 
            </View>
          </View>

      </View>
    </View>
  );
};

const styles = (activeSchema: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    card: {
      backgroundColor: activeSchema == 'light' ? '#ffe6e6' : '#862d59',
      padding: 10,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: activeSchema == 'light' ? '#ffe6e6' : '#8f246b',
    },
    contentContainer: {
      flexDirection: 'row',
     
    },
    image: {
      borderRadius: 10,
      height: 190,
      width: 190,
      marginVertical: 10,
    },
    textContainer: {
      flex: 1,
      marginLeft: 10,
      marginTop: 10,
    },
    createdAt: {
      marginTop: 5,
      color: activeSchema == 'light' ? '#333' : '#fff',
    },
  });

export default CollectionComponent;
