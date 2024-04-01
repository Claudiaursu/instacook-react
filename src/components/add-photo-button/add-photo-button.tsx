import React from 'react';
import { TouchableOpacity, StyleSheet, Text, TouchableOpacityProps } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeConsumer } from '../../utils/theme/theme.consumer';


interface AddPhotoButtonProps extends TouchableOpacityProps {
  onPress: () => void;
}

const AddPhotoButton: React.FC<AddPhotoButtonProps> = ({ onPress, ...props }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} {...props}>
      <MaterialCommunityIcons name="chef-hat" size={24} color={theme.colors.primary} />
      <Text>Add Photo</Text> {/* Optional text label */}
    </TouchableOpacity>
  );
};

const {
  theme,
  activeScheme,
  toggleThemeSchema
} = useThemeConsumer();

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff', // Example color, adjust as needed
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: '#fff', // Text color
    marginLeft: 5, // Adjust spacing between icon and text
  },
});

export default AddPhotoButton;
