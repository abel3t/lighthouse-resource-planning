import { Person } from '@prisma/client';
import axios from 'axios';
import queryString from 'query-string';
import { create } from 'zustand';

import { client } from '@/lib/client';

import { QueryParams } from './useFundRecordStore';

export interface MemberStore {
  members: Person[];
  metadata: any;
  fetchMembers: (queryParams: QueryParams) => void;
  fetchAllMembers: () => void;
  queryParams: QueryParams;
  setQueryParams: (params: QueryParams) => void;
  allMembers: {
    id: string;
    name: string;
  }[];
}

const useMemberStore = create<MemberStore>((set) => ({
  members: [],
  allMembers: [],
  metadata: {},
  fetchMembers: async (queryParams: QueryParams) => {
    const { sort = { field: 'id', order: 'asc' }, search = '', pagination = { page: 1, pageSize: 10 } } = queryParams;

    const qs = queryString.stringify({
      sort: `${sort.field}.${sort.order}`,
      search,
      page: pagination.page,
      pageSize: pagination.pageSize
    });

    const data = await client.get('/members/?' + qs).then((res) => res.data);
    set({ members: data?.data || [] });
    set({ metadata: data?.metadata || {} });
  },
  fetchAllMembers: async () => {
    const members = await client.get('/all-members').then((res) => res.data);
    set({ allMembers: members || [] });
  },
  queryParams: {
    sort: undefined,
    pagination: {
      page: 1,
      pageSize: 10
    },
    search: ''
  },
  setQueryParams: (params: QueryParams) => {
    set((state) => ({
      queryParams: {
        search: params.search || state.queryParams.search,
        sort: params.sort
          ? {
              field: params.sort?.field || 'id',
              order: params.sort?.order || 'asc'
            }
          : state.queryParams.sort,
        pagination: params.pagination
          ? {
              page: params.pagination?.page || 1,
              pageSize: params.pagination?.pageSize || 10
            }
          : state.queryParams.pagination
      }
    }));
  }
}));

export default useMemberStore;
