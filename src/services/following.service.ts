import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type UserFollowingProps = {
  urmaritor: Object,
  urmarit: Object
};

export const userFollowingSlice = createApi({
  reducerPath: "userFollowing",
  baseQuery: fetchBaseQuery({
    //buc
    baseUrl: "http://192.168.100.46:9083/v1/following",
    //cta
    //baseUrl: "http://192.168.10.102:9083/v1/following",
  }),
  tagTypes: ["Following"],
  endpoints: (builder) => ({
    getFollowStatus: builder.query<{status: boolean}, { source: number, destination: number,  token: string}>({
      query: ({ source, destination, token }) => ({
        url: `/status?source=${source}&destination=${destination}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    followUser: builder.mutation<undefined, {relation: UserFollowingProps, token: string}>({
      query: ({relation, token}) => ({
        url: "/follow",
        method: "POST",
        body: relation,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Following"],
    }),
    unfollowUser: builder.mutation<undefined, {relation: UserFollowingProps, token: string}>({
      query: ({relation, token}) => ({
        url: "/unfollow",
        method: "POST",
        body: relation,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Following"],
    })
  })
});

export const { 
  useGetFollowStatusQuery,
  useFollowUserMutation,
  useUnfollowUserMutation 
} = userFollowingSlice;
