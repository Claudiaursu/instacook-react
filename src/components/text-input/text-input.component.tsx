import React from "react";
import {
  TextInput as NativeTextInput,
  TextInputProps as NativeTextInputProps,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { ThemeColors } from "../../utils/theme/colors";
import { spacing } from "../../utils/theme/spacing";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import { Text } from "../text";

interface TextInputProps extends NativeTextInputProps {
  textStyle?: TextStyle;
  viewStyle?: StyleProp<ViewStyle>;
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const TextInput = ({
  textStyle,
  label,
  onChangeText,
  viewStyle,
  ...props
}: TextInputProps) => {
  const {
    theme: { colors },
  } = useThemeConsumer();

  const textInputStyles = styles(colors);
  return (
    <View style={viewStyle}>
      <Text sx={textStyle}>{label}</Text>
      <NativeTextInput
        style={textInputStyles.container}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  );
};

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      // borderWidth: 1,
      borderRadius: 10,
      paddingVertical: 10,
      color: colors.text,
      backgroundColor: colors.inputBackground,
      paddingHorizontal: 20,
      borderColor: colors.text,
      marginTop: spacing(2),
    },
  });
