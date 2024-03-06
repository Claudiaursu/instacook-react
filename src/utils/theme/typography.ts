import { TextStyle } from "react-native";
import { ThemeColors } from "./colors";

export type TitleVariants = "title" | "subtitle" | "technicalText";

export type TypographyProps = { [key in TitleVariants]: TextStyle };

const typography: TypographyProps = {
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "pink"
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  technicalText: {
    fontSize: 12,
    fontWeight: "300",
  },
};

export const typographyWithColor = (colors: ThemeColors) => ({
  title: {
    color: colors.text,
    ...typography.title,
  },
  subtitle: {
    color: colors.text,
    ...typography.subtitle,
  },
  technicalText: {
    color: colors.text,
    ...typography.technicalText,
  },
});