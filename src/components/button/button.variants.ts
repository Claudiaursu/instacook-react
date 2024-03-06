import { TextStyle, ViewStyle } from "react-native";
import { ThemeColors } from "../../utils/theme/colors";
import { ButtonVariants } from "./button.component";

type ButtonVariant = {
  container?: ViewStyle;
  text?: TextStyle;
};

export const buttonVariants = (
  colors: ThemeColors
): { [key in ButtonVariants]: ButtonVariant } => ({
  primary: {
    container: {
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignSelf: 'flex-start',
      alignItems: "center",
      height: 40,
    },
    text: {
      color: colors.textButton,
      margin: 10
    },
  },
  secondary: {
    container: {
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: 'flex-start',
      height: 40,
      borderWidth: 2,
      borderColor: colors.invertTextButton,
    },
    text: {
      color: colors.invertTextButton,
      margin: 10
    },
  },
  tertiary: {
    container: {
      justifyContent: "center",
      alignItems: "center",
      height: 20,
    },
    text: {
      color: colors.invertTextButton,
    },
  },
});