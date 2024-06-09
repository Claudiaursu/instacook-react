import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type LikeProps = {
  reteta: Object,
  utilizator: Object
};

export const likesSlice = createApi({
  reducerPath: "recipeReactions",
  baseQuery: fetchBaseQuery({
    //buc
    baseUrl: "http://192.168.100.46:9083/v1/reactions",
    //cta
    //baseUrl: "http://192.168.10.102:9083/v1/reactions",
  }),
  tagTypes: ["Likes"],
  endpoints: (builder) => ({
    likeRecipe: builder.mutation<undefined, {like: LikeProps, token: string}>({
      query: ({like, token}) => ({
        url: "",
        method: "POST",
        body: like,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Likes"],
    }),
    likeRecipeFromFeed: builder.mutation<undefined, {like: LikeProps, token: string}>({
      query: ({like, token}) => ({
        url: "/feed",
        method: "POST",
        body: like,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Likes"],
    }),
    unlikeRecipe: builder.mutation<undefined, {like: LikeProps, token: string}>({
      query: ({like, token}) => ({
        url: `/remove`,
        method: "POST",
        body: like,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Likes"],
    })
  })
});

export const { 
  useLikeRecipeMutation,
  useUnlikeRecipeMutation,
  useLikeRecipeFromFeedMutation
} = likesSlice;
