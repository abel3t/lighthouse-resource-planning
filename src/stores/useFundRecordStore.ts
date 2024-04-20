import { Fund } from '@prisma/client';
import queryString from 'query-string';
import { create } from 'zustand';

import { client } from '@/lib/client';

export type QueryParams = {
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  search?: string;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
};

export interface FundStore {
  records: Fund[];
  metadata: any;
  fetchRecords: (fundId: string, queryParams: QueryParams) => void;
  queryParams: QueryParams;
  setQueryParams: (params: QueryParams) => void;
}

const useFundRecordStore = create<FundStore>((set) => ({
  records: [],
  metadata: {},
  fetchRecords: async (fundId: string, queryParams: QueryParams) => {
    const { sort = { field: 'id', order: 'asc' }, search = '', pagination = { page: 1, pageSize: 10 } } = queryParams;

    const qs = queryString.stringify({
      sort: `${sort.field}.${sort.order}`,
      search,
      page: pagination.page,
      pageSize: pagination.pageSize,
      fundId
    });

    const data = await client.get('/fund-record/?' + qs).then((res) => res.data);
    set({ records: data?.data || [] });
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

export default useFundRecordStore;
