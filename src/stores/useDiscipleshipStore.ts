import { Discipleship, Person } from '@prisma/client';
import queryString from 'query-string';
import { create } from 'zustand';

import { client } from '@/lib/client';

import { QueryParams } from './useFundRecordStore';

export interface DiscipleshipStore {
  discipleshipList: Discipleship[];
  metadata: any;
  fetchDiscipleshipList: (queryParams: QueryParams) => void;
  queryParams: QueryParams;
  setQueryParams: (params: QueryParams) => void;
}

const useDiscipleshipStore = create<DiscipleshipStore>((set) => ({
  discipleshipList: [],
  metadata: {},
  fetchDiscipleshipList: async (queryParams: QueryParams) => {
    const { sort = { field: 'id', order: 'asc' }, search = '', pagination = { page: 1, pageSize: 10 } } = queryParams;

    const qs = queryString.stringify({
      sort: `${sort.field}.${sort.order}`,
      search,
      page: pagination.page,
      pageSize: pagination.pageSize
    });

    const data = await client.get('/discipleship/?' + qs).then((res) => res.data);
    set({ discipleshipList: data?.data || [] });
    set({ metadata: data?.metadata || {} });
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

export default useDiscipleshipStore;
