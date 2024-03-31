type ColorsKeys =
  | "primary"
  | "secondary"
  | "tertiary"
  | "error"
  | "background"
  | "background2"
  | "inputBackground"
  | "text"
  | "text2"
  | "textButton"
  | "cardTitle"
  | "cardBackground"
  | "card"
  | "border"
  | "notification"
  | "invertTextButton";

export type ThemeColors = { [key in ColorsKeys]: string };

export const lightColors: ThemeColors = {
  primary: "#ffb3b3",
  secondary: "#5c5d72",
  tertiary: "#78536b",
  error: "#ba1a1a",
  background: "#d6f5f5",
  background2: "#ffe6e6",
  inputBackground: "#ffe6e6",
  cardBackground: "#ffe6e6",
  cardTitle: "#ac3973",
  text: "#1b1b1f",
  text2: "#44133A",
  textButton: "#fff",
  invertTextButton: "#1b1b1f",
  card: "#fffbff",
  border: "#1b1b1f",
  notification: "#1b1b1f",
};

export const darkColors: ThemeColors = {
  primary: "#bf4080",
  secondary: "#ff99bb",
  tertiary: "#e8b9d5",
  error: "#ffb4ab",
  background: "#006666",
  background2: "#452A52",
  inputBackground: "#ffe6e6",
  cardBackground: "#ffe6e6",
  cardTitle: "#f9ecf2",
  text: "#fffbff",
  text2: "#E7C5F8",
  textButton: "#fff",
  invertTextButton: "#fff",
  card: "#1b1b1f",
  border: "#fff",
  notification: "#fff",
};