import React, { createContext, useCallback, useMemo, useState } from "react";
import { darkTheme, lightTheme } from "./theme";
type ThemeSchemaProps = "light" | "dark";

export const ThemeContext = createContext({
  theme: lightTheme,
  toggleThemeSchema: () => {},
  activeScheme: "light",
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeSchema, setThemeSchema] = useState<ThemeSchemaProps>("light");
  const activeTheme = themeSchema === "light" ? lightTheme : darkTheme;

  const toggleThemeSchema = useCallback(() => {
    if (themeSchema === "light") {
      setThemeSchema("dark");
    } else {
      setThemeSchema("light");
    }
  }, [themeSchema]);

  const contextValue = useMemo(
    () => ({
      theme: activeTheme,
      toggleThemeSchema,
      activeScheme: themeSchema,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [themeSchema] 
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};