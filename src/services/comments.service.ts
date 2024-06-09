import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type CommentProps = {
  reteta?: Object,
  utilizator?: Object,
  text?: string
};

export const commentsSlice = createApi({
  reducerPath: "recipeComments",
  baseQuery: fetchBaseQuery({
    //buc
    baseUrl: "http://192.168.100.46:9083/v1/comments",
    //cta
    //baseUrl: "http://192.168.10.102:9083/v1/comments",
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
    updateRecipeComment: builder.mutation<undefined, {comment: CommentProps, token: string, commentId: string}>({
      query: ({comment, token, commentId}) => ({
        url: `/${commentId}`,
        method: "PATCH",
        body: comment,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Comments"],
    }),
    deleteRecipeComment: builder.mutation<undefined, {commentId: string, token: string}>({
      query: ({commentId, token}) => ({
        url: `/remove/${commentId}`,
        method: "DELETE",
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
  useDeleteRecipeCommentMutation,
  useUpdateRecipeCommentMutation
} = commentsSlice;
