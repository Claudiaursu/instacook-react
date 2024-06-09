import { getDownloadURL, ref } from 'firebase/storage';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useThemeConsumer } from '../../utils/theme/theme.consumer';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Text } from '../text';
import React from 'react';
import { UserDto } from '../../services/user-interaction.service';
import { storage } from '../../utils/firebase/firebase';

export const SearchedUserComponent = ({ user, onPress }: { user: UserDto, onPress: () => void }) => {
  const loggedId = useSelector((state: RootState) => state.userData.loggedId);
  const [userImageUrl, setUserImageUrl] = useState('');

  useEffect(() => {
    const getUserPicture = async () => {
      const path = user?.pozaProfil;
      if (path) {
        const imgRef = ref(storage, path);
        const imgUrl = await getDownloadURL(imgRef);
        setUserImageUrl(imgUrl);
      }
    };
    getUserPicture();
    console.log("user in search ", user)
  }, [user]);

  const { theme } = useThemeConsumer();

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        {userImageUrl ? (
          <Image source={{ uri: userImageUrl }} style={styles.profilePic} />
        ) : (
          <View style={styles.profilePicPlaceholder}></View>
        )}
        <View style={styles.textContainer}>
          <Text sx={styles.username} variant="subtitle">
            {user?.username}
          </Text>
          <Text sx={styles.fullName} variant="subtitle">
            {user?.nume} {user?.prenume}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 2 * CARD_MARGIN,
    marginHorizontal: CARD_MARGIN,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F5EEF8',
    borderRadius: 8,
    // Removed shadow properties
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profilePicPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fullName: {
    fontSize: 14,
    color: '#555',
  },
});

export default SearchedUserComponent;
