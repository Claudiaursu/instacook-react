import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Timespan } from "react-native/Libraries/Utilities/IPerformanceLogger";

type RecipeProps = {
  titluColectie: string,
  descriereColectie: string,
  publica: boolean,
  calePoza?: string,
  utilizator: number
}

export type RecipeDto = {
  id: string,
  titluReteta: string,
  dificultate: string,
  ingrediente: Array<string>,
  instructiuni: string,
  calePoza: string,
  caleVideo: string,
  participaConcurs: boolean,
  deletedAt: number;
  createdAt: number;
  updatedAt: number;
};

export const recipeSlice = createApi({
  reducerPath: "recipes",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.100.46:3333/v1/recipes",
    //baseUrl: "http://192.168.10.102:3333/v1/collections",
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
  }),
});

export const { useAddNewRecipeMutation, useGetRecipesByUserIdQuery } = recipeSlice;