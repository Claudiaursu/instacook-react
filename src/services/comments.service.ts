import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type CommentProps = {
  reteta: Object,
  utilizator: Object,
  text?: string
};

export const commentsSlice = createApi({
  reducerPath: "recipeComments",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.100.46:9083/v1/comments",
  }),
  tagTypes: ["Comments"],
  endpoints: (builder) => ({
    addRecipeComment: builder.mutation<undefined, {comment: CommentProps, token: string}>({
      query: ({comment, token}) => ({
        url: "",
        method: "POST",
        body: comment,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Comments"],
    }),
    deleteRecipeComment: builder.mutation<undefined, {comment: CommentProps, token: string}>({
      query: ({comment, token}) => ({
        url: `/remove`,
        method: "POST",
        body: comment,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Comments"],
    })
  })
});

export const { 
  useAddRecipeCommentMutation,
  useDeleteRecipeCommentMutation
} = commentsSlice;
