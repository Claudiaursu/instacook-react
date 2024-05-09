import { StyleSheet } from "react-native";
import { ThemeColors } from "../../utils/theme/colors";
import { spacing } from "../../utils/theme/spacing";

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    authContainer: {
      width: "86%",
      marginLeft: "7%",
      flex: 1,
      marginTop: spacing(6),
    },
    errorMessage: {
      marginTop: spacing(3),
      color: colors.error,
      fontWeight: "500",
      fontSize: 14,
    },
    signInLabel: {
      marginBottom: spacing(5),
    },
    errorText: {
      color: colors.error,
      fontSize: 16,
      fontWeight: "500",
    },
    signInButton: {
      marginVertical: spacing(5),
    },
    passwordInput: {
      marginTop: spacing(3),
    },
    orContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: spacing(5),
    },
    orContainerLine: {
      height: 1,
      backgroundColor: colors.text,
      flex: 0.48,
    },
    logoOuterContainer: {
      width: "100%",
      alignItems: "center",
    },
    logoContainer: {
      flexDirection: "row",
      width: 150,
      justifyContent: "space-between",
    },
    newAccount: {
      flexDirection: "row",
      justifyContent: "center",
      marginVertical: spacing(4),
    },
    createNewAccount: {
      color: colors.primary,
      marginLeft: spacing(1),
    },
  });

export default styles;