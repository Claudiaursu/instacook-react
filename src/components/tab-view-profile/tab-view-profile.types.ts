export type TabViewProfileParamList = {
  Collections: { userId: number } | { userId: number, refresh: number };
  Recipes: { userId: number } | { userId: number, refresh: number };
};