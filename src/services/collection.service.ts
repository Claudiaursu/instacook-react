import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Timespan } from "react-native/Libraries/Utilities/IPerformanceLogger";

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
  deletedAt: number;
  createdAt: number;
  updatedAt: number;
};

export const collectionSlice = createApi({
  reducerPath: "collections",
  baseQuery: fetchBaseQuery({
    //baseUrl: "http://192.168.100.46:3333/v1/collections",
    baseUrl: "http://192.168.10.102:3333/v1/collections",
  }),
  tagTypes: ["Collections"],
  endpoints: (builder) => ({
    getCollectionsByUserId: builder.query<CollectionDto[], { id: number,  token: string}>({
      query: ({ id, token }) => ({
        url: `/user/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
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
  }),
});

export const { useAddNewCollectionMutation, useGetCollectionsByUserIdQuery } = collectionSlice;