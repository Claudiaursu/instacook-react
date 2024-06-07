import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type NotificationDto = {
  id: string,
  text: string,
  info: string,
  categorie: string,
  citita: boolean,
  deletedAt: number;
  createdAt: number;
  updatedAt: number;
};


export const notificationSlice = createApi({
  reducerPath: "notifications",
  baseQuery: fetchBaseQuery({
    //buc
    //baseUrl: "http://192.168.100.46:9083/v1/notifications",
    //cta
    baseUrl: "http://192.168.10.102:9083/v1/notifications",
  }),
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotificationsByUserId: builder.query<NotificationDto[], { id: number,  token: string}>({
      query: ({ id, token }) => ({
        url: `/users/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getUnseenNotificationsByUserId: builder.query<NotificationDto[], { id: number,  token: string}>({
      query: ({ id, token }) => ({
        url: `/users/unseen/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { 
  useGetNotificationsByUserIdQuery,
  useGetUnseenNotificationsByUserIdQuery
} = notificationSlice;
