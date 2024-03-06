import React from "react";
import {
  Text as NativeText,
  TextProps as NativeTextProps,
  TextStyle,
} from "react-native";
import { useThemeConsumer } from "../../utils/theme/theme.consumer";
import { TitleVariants } from "../../utils/theme/typography";

interface TextProps extends NativeTextProps {
  variant?: TitleVariants;
  sx?: TextStyle;
}

type TextPropsWithNoBaseStyle = Omit<TextProps, "style">;

export const Text = ({
  children,
  variant = "technicalText",
  sx,
  ...props
}: TextPropsWithNoBaseStyle) => {
  const {
    theme: { typography },
  } = useThemeConsumer();

  return (
    <NativeText style={[{ ...typography[variant] }, sx]} {...props}>
      {children}
    </NativeText>
  );
};