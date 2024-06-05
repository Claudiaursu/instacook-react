import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Timespan } from "react-native/Libraries/Utilities/IPerformanceLogger";
import { RecipeWithReactionsDto } from "./types";

type RecipeProps = {
  titluReteta: string,
  dificultate: string,
  instructiuni: string,
  ingrediente: Array<string>,
  calePoza?: string,
  colectie: object
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
  colectie: string;
};

export type RecipeSummaryDto = {
  id: string,
  titlureteta: string,
  dificultate: string,
  ingrediente: Array<string>,
  instructiuni: string,
  calepoza: string,
  calevideo: string,
  participaconcurs: boolean,
  deletedat: number;
  createdat: number;
  updatedat: number;
  colectie: string;
  reactii: string;
  comentarii: string;
};


export const recipeSlice = createApi({
  reducerPath: "recipes",
  baseQuery: fetchBaseQuery({
    //buc
    //baseUrl: "http://192.168.100.46:3333/v1/recipes",
    //cta
    baseUrl: "http://192.168.10.103:3333/v1/collections",
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
  }),
});

export const { 
  useAddNewRecipeMutation, 
  useGetRecipesByUserIdQuery,
  useGetRecipesByCollectionIdQuery,
  useGetRecipeByIdQuery
} = recipeSlice;
