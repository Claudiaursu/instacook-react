import { TextStyle } from "react-native";
import { ThemeColors } from "./colors";

export type TitleVariants = "title" | "subtitle" | "technicalText" | "profileTitle";

export type TypographyProps = { [key in TitleVariants]: TextStyle };

const typography: TypographyProps = {
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "pink"
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: "700"
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
  profileTitle: {
    cplor: colors.text2,
    ...typography.title,
  }
});