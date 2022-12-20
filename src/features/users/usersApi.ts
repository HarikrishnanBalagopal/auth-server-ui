import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthUser } from './usersSlice';
import { AUTH_SERVER_REALM } from '../common/constants';

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/auth-server',
        credentials: 'include',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');
            return headers;
        }
    }),
    tagTypes: ['users'],
    endpoints: (builder) => ({
        getUserInfo: builder.query<AuthUser, void>({
            query: () => "/realms/" + AUTH_SERVER_REALM +  "/protocol/openid-connect/userinfo",
        }),
        listUsers: builder.query<Array<AuthUser>, void>({
            query: () => '/admin/realms/'+AUTH_SERVER_REALM+'/users',
            providesTags: ['users'],
        }),
        createUser: builder.mutation<{ id: string }, AuthUser>({
            query: (user) => ({
                url: '/admin/realms/'+AUTH_SERVER_REALM+'/users',
                method: 'POST',
                body: user,
            }),
            invalidatesTags: ['users'],
        }),
        updateUser: builder.mutation<{ id: string }, AuthUser>({
            query: (user) => ({
                url: `/admin/realms/${AUTH_SERVER_REALM}/users/${user.id}`,
                method: 'PUT',
                body: user,
            }),
            invalidatesTags: ['users'],
        }),
        deleteUsers: builder.mutation<void, Array<string>>({
            query: (ids) => ({
                url: '/admin/realms/'+AUTH_SERVER_REALM+'/users',
                method: 'DELETE',
                body: ids,
            }),
            invalidatesTags: ['users'],
        }),
    }),
});

export const { useGetUserInfoQuery, useListUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUsersMutation } = usersApi;
