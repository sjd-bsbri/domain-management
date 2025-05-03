import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Domain, DomainRequest } from '../types';

const API_BASE_URL = 'https://6797aa2bc2c861de0c6d964c.mockapi.io/';

const baseQueryWithLogging = async (args: any, api: any, extraOptions: any) => {
  console.log('API Request:', args);
  const baseQuery = fetchBaseQuery({ baseUrl: API_BASE_URL });
  try {
    const result = await baseQuery(args, api, extraOptions);
    console.log('API Response:', result);
    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const domainApi = createApi({
  reducerPath: 'domainApi',
  baseQuery: baseQueryWithLogging,
  tagTypes: ['Domain'],
  endpoints: (builder) => ({
    getDomains: builder.query<Domain[], void>({
      query: () => 'domain',
      providesTags: ['Domain'],
    }),
    getDomainById: builder.query<Domain, string>({
      query: (id) => `domain/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Domain', id }],
    }),
    addDomain: builder.mutation<Domain, DomainRequest>({
      query: (domain) => ({
        url: 'domain',
        method: 'POST',
        body: {
          ...domain,
          createdDate: domain.createdDate || Math.floor(Date.now() / 1000),
          status: domain.status || 'pending',
        },
      }),
      invalidatesTags: ['Domain'],
    }),
    updateDomain: builder.mutation<Domain, { id: string; domain: Partial<DomainRequest> }>({
      query: ({ id, domain }) => ({
        url: `domain/${id}`,
        method: 'PUT',
        body: domain,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Domain', id }, 'Domain'],
    }),
    deleteDomain: builder.mutation<void, string>({
      query: (id) => ({
        url: `domain/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Domain'],
    }),
  }),
});

export const { 
  useGetDomainsQuery, 
  useGetDomainByIdQuery, 
  useAddDomainMutation, 
  useUpdateDomainMutation, 
  useDeleteDomainMutation 
} = domainApi; 