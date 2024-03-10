import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type User = {
  email: string;
  parola: string;
};

type LoginResult = {
  token: string
}

export const loginSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.100.46:8080/v1/auth",
  }),
  tagTypes: ["Login"],
  endpoints: (builder) => ({
    doLogin: builder.mutation<LoginResult, User>({
      query: (login) => ({
        url: "/login",
        method: "POST",
        body: login,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }),
      invalidatesTags: ["Login"],
    }),
  }),
});

export const { useDoLoginMutation } = loginSlice