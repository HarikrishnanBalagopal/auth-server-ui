import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Role } from './rolesSlice';
import { AUTH_SERVER_REALM, AUTH_SERVER_UI_CLIENT_ID } from '../common/constants';

export const rolesApi = createApi({
    reducerPath: 'rolesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/auth-server',
        credentials: 'include',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');
            return headers;
        }
    }),
    tagTypes: ['roles'],
    endpoints: (builder) => ({
        listRoles: builder.query<Array<Role>, void>({
            query: () => `/admin/realms/${AUTH_SERVER_REALM}/clients/${AUTH_SERVER_UI_CLIENT_ID}/roles?no_conversion=true`,
            providesTags: ['roles'],
        }),
        createRole: builder.mutation<{ id: string }, Role>({
            query: (role) => ({
                url: `/admin/realms/${AUTH_SERVER_REALM}/clients/${AUTH_SERVER_UI_CLIENT_ID}/roles?no_conversion=true`,
                method: 'POST',
                body: role,
            }),
            invalidatesTags: ['roles'],
        }),
        updateRole: builder.mutation<{ id: string }, Role>({
            query: (role) => ({
                url: `/admin/realms/${AUTH_SERVER_REALM}/clients/${AUTH_SERVER_UI_CLIENT_ID}/roles/${role.metadata.id}?no_conversion=true`,
                method: 'PUT',
                body: role,
            }),
            invalidatesTags: ['roles'],
        }),
        deleteRoles: builder.mutation<void, Array<string>>({
            query: (ids) => ({
                url: `/admin/realms/${AUTH_SERVER_REALM}/clients/${AUTH_SERVER_UI_CLIENT_ID}/roles`,
                method: 'DELETE',
                body: ids,
            }),
            invalidatesTags: ['roles'],
        }),
    }),
});

export const { useListRolesQuery, useCreateRoleMutation, useUpdateRoleMutation, useDeleteRolesMutation } = rolesApi;
