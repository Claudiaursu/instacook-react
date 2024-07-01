import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Timespan } from "react-native/Libraries/Utilities/IPerformanceLogger";
import { UserResetPassProps } from "./types";

type UrmarireDto = {
  id: string,
  urmaritor_id: number,
  urmarit_id: number,
  deletedAt: Timespan;
  createdAt: Timespan;
  updatedAt: Timespan;
}

export type UserDto = {
  id: string,
  username: string;
  nume: string;
  prenume: string;
  parola: string;
  email: string;
  taraOrigine: string;
  pozaProfil: string;
  telefon: string;
  totalPuncte: number;
  followers: UrmarireDto[];
  follows: UrmarireDto[];
  deletedAt: Timespan;
  createdAt: Timespan;
  updatedAt: Timespan;
};

export type UserProps = {
  username: string;
  nume: string;
  prenume: string;
  parola: string;
  email: string;
  taraOrigine: string;
  telefon: string;
  totalPuncte?: number;
  pozaProfil?: string;
};

export const userInteractionSlice = createApi({
  reducerPath: "userInteraction",
  baseQuery: fetchBaseQuery({
    //buc
    baseUrl: "http://192.168.100.46:9083/v1/users",
    //cta
    //baseUrl: "http://192.168.10.102:9083/v1/users",
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUserById: builder.query<UserDto, { id: number,  token: string}>({
      query: ({ id, token }) => ({
        url: `/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getUserByUsername: builder.query<UserDto, string>({
      query: (username) => `/username/${username}`,
    }),
    getUsersBySearch: builder.query<UserDto[], string>({
      query: (query) => `/search/${query}`,
    }),
    addNewUser: builder.mutation<undefined, UserProps>({
      query: (post) => ({
        url: "/",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<undefined, { id: number,  token: string}>({
      query: ({id, token}) => ({
        url: `/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Users"],
    }),
    editUser: builder.mutation<undefined, { user: UserProps, token: string, id: string} >({
      query: ({user, token, id}) => ({
        url: `/${id}`,
        method: "PATCH",
        body: user,

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Users"],
    }),
    resetPassword: builder.mutation<undefined, {user: UserResetPassProps,  token: string} >({
      query: ({user, token}) => ({
        url: "/passReset",
        method: "POST",
        body: user,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { 
  useAddNewUserMutation, 
  useGetUserByUsernameQuery,
  useGetUsersBySearchQuery,
  useGetUserByIdQuery,
  useEditUserMutation,
  useDeleteUserMutation,
  useResetPasswordMutation 
} = userInteractionSlice
