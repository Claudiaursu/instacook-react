import {
  Pressable,
  ViewStyle,
  ButtonProps as NativeButtonProps,
} from "react-native";
import React from "react";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import { Text } from "../text";
import { buttonVariants } from "./button.variants";

export type ButtonVariants = "primary" | "secondary" | "tertiary";
interface ButtonProps extends NativeButtonProps {
  sx?: ViewStyle;
  variant?: ButtonVariants;
}

export const Button = ({ 
  variant = "primary", 
  sx, 
  ...props 
}: ButtonProps) => {
  const {
    theme: { colors },
  } = useThemeConsumer();

  const buttonStyles = buttonVariants(colors)[variant];

  return (
    <Pressable style={[buttonStyles.container, sx]} {...props}>
      <Text sx={buttonStyles.text} variant="subtitle">
        {props.title}
      </Text>
    </Pressable>
  );
};