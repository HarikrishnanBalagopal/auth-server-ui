import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const supportApi = createApi({
    reducerPath: 'supportApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/auth-server',
        credentials: 'include',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');
            return headers;
        }
    }),
    tagTypes: ['support'],
    endpoints: (builder) => ({
        getSupportInfo: builder.query<{[k:string]: string}, void>({
            query: () => '/support',
            providesTags: ['support'],
        }),
    }),
});

export const { useGetSupportInfoQuery } = supportApi;
