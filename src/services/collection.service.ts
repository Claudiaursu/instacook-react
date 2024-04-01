import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Timespan } from "react-native/Libraries/Utilities/IPerformanceLogger";

type CollectionProps = {
  titluColectie: string,
  descriereColectie: string,
  publica: string,
  calePoza: string,
  utilizator: number
}

type CollectionDto = {
  id: string,
  titluColectie: string,
  descriereColectie: string,
  publica: string,
  calePoza: string,
  deletedAt: Timespan;
  createdAt: Timespan;
  updatedAt: Timespan;
};

export const collectionSlice = createApi({
  reducerPath: "collections",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.100.46:3333/v1/collections",
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
    addNewCollection: builder.mutation<undefined, CollectionProps>({
      query: (collection) => ({
        url: "/",
        method: "POST",
        body: collection,
      }),
      invalidatesTags: ["Collections"],
    }),
  }),
});

export const { useAddNewCollectionMutation, useGetCollectionsByUserIdQuery } = collectionSlice;