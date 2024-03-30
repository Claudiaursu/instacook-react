import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Timespan } from "react-native/Libraries/Utilities/IPerformanceLogger";

type UserDto = {
  id: string,
  username: string;
  nume: string;
  prenume: string;
  parola: string;
  email: string;
  taraOrigine: string;
  telefon: string;
  totalPuncte: number;
  deletedAt: Timespan;
  createdAt: Timespan;
  updatedAt: Timespan;
};

type UserProps = {
  username: string;
  nume: string;
  prenume: string;
  parola: string;
  email: string;
  taraOrigine: string;
  telefon: string;
  totalPuncte: number;
};

export const userInteractionSlice = createApi({
  reducerPath: "userInteraction",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.100.46:9083/v1/users",
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUserByUsername: builder.query<UserDto, string>({
      query: (username) => `/username/${username}`,
    }),
    addNewUser: builder.mutation<undefined, UserProps>({
      query: (post) => ({
        url: "/",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useAddNewUserMutation, useGetUserByUsernameQuery } = userInteractionSlice