import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Timespan } from "react-native/Libraries/Utilities/IPerformanceLogger";
import { RecipeDto } from "./recipe.service";

type CollectionProps = {
  titluColectie: string,
  descriereColectie: string,
  publica: boolean,
  calePoza?: string,
  utilizator: number
}

export type CollectionDto = {
  id: string,
  titluColectie: string,
  descriereColectie: string,
  publica: string,
  calePoza: string,
  retete: Array<RecipeDto>,
  deletedAt: number;
  createdAt: number;
  updatedAt: number;
};

export const collectionSlice = createApi({
  reducerPath: "collections",
  baseQuery: fetchBaseQuery({
    //baseUrl: "http://192.168.100.46:3333/v1/collections", //buc
    baseUrl: "http://192.168.10.103:3333/v1/collections",
  }),
  tagTypes: ["Collections"],
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getCollectionsByUserId: builder.query<CollectionDto[], { id: number,  token: string}>({
      query: ({ id, token }) => ({
        url: `/user/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg
      }
    }),
    getPublicCollectionsByUserId: builder.query<CollectionDto[], { id: number,  token: string}>({
      query: ({ id, token }) => ({
        url: `/public/user/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg
      }
    }),
    addNewCollection: builder.mutation<undefined, { collection: CollectionProps, token: string} >({
      query: ({collection, token}) => ({
        url: "/",
        method: "POST",
        body: collection,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Collections"],
    }),
    deleteCollectionById: builder.mutation<undefined, { id: string, token: string }>({
      query: ({ id, token }) => ({
        url: `/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Collections"],
    }),
  }),
});

export const { 
  useAddNewCollectionMutation, 
  useGetCollectionsByUserIdQuery,
  useDeleteCollectionByIdMutation,
  useGetPublicCollectionsByUserIdQuery
} = collectionSlice;