import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Timespan } from "react-native/Libraries/Utilities/IPerformanceLogger";
import { RecipeDto, RecipeFeedDto, RecipeProps, RecipeSummaryDto, RecipeWithReactionsDto } from "./types";

export const recipeSlice = createApi({
  reducerPath: "recipes",
  baseQuery: fetchBaseQuery({
    //buc
    baseUrl: "http://192.168.100.46:3333/v1/recipes",
    //cta
    //baseUrl: "http://192.168.10.102:3333/v1/recipes",
  }),
  tagTypes: ["Recipes"],
  endpoints: (builder) => ({
    getRecipesByUserId: builder.query<RecipeDto[], { id: number,  token: string}>({
      query: ({ id, token }) => ({
        url: `/users/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getRecipesByCollectionId: builder.query<RecipeSummaryDto[], { id: number,  token: string}>({
      query: ({ id, token }) => ({
        url: `/collection/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getFeedRecipesForUser: builder.query<RecipeFeedDto[], { id: number,  token: string}>({
      query: ({ id, token }) => ({
        url: `/feed/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getFeedFollowRecipesForUser: builder.query<RecipeFeedDto[], { id: number,  token: string}>({
      query: ({ id, token }) => ({
        url: `/feed/following/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getRecipeById: builder.query<RecipeWithReactionsDto, { id: number,  token: string}>({
      query: ({ id, token }) => ({
        url: `/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    addNewRecipe: builder.mutation<undefined, { recipe: RecipeProps, token: string} >({
      query: ({recipe, token}) => ({
        url: "/",
        method: "POST",
        body: recipe,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Recipes"],
    }),
    deleteRecipeById: builder.mutation<undefined, { id: string, token: string }>({
      query: ({ id, token }) => ({
        url: `/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Recipes"],
    }),
  }),
});

export const { 
  useAddNewRecipeMutation, 
  useGetRecipesByUserIdQuery,
  useGetRecipesByCollectionIdQuery,
  useGetRecipeByIdQuery,
  useGetFeedFollowRecipesForUserQuery,
  useGetFeedRecipesForUserQuery,
  useDeleteRecipeByIdMutation
} = recipeSlice;
