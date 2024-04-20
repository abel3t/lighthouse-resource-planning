'use client';

import useFundRecordStore from '@/stores/useFundRecordStore';
import useFundStore from '@/stores/useFundStore';
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useDebounce } from '@uidotdev/usehooks';
import { use, useEffect, useMemo, useState } from 'react';

import { DataTable } from '@/components/custom/data-table';
import { DataTableToolbar } from '@/components/custom/data-table/data-table-toolbar';

import { getColumns, searchField } from './fund-record-table-columns';
import { FundRecordTableToolbarActions } from './fund-record-table-toolbar-actions';

export default function FundRecordTable() {
  const fundRecords = useFundRecordStore((state) => state.records);
  const fetchFundRecords = useFundRecordStore((state) => state.fetchRecords);
  const metaData = useFundRecordStore((state) => state.metadata);

  const currentFund = useFundStore((state) => state.currentFund);

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo(() => getColumns(), []);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ id: false });

  const queryParams = useFundRecordStore((state) => state.queryParams);
  const setQueryParams = useFundRecordStore((state) => state.setQueryParams);

  const debouncedSearch = useDebounce(queryParams, 300);

  useEffect(() => {
    fetchFundRecords(currentFund?.id || '', debouncedSearch);
  }, [debouncedSearch.search, currentFund?.id]);

  const handlePaginationChange = (updater: any) => {
    const nextState = updater(pagination);
    fetchFundRecords(currentFund?.id || '', {
      ...queryParams,
      pagination: {
        page: nextState.pageIndex + 1,
        pageSize: nextState.pageSize
      }
    });

    setPagination(nextState);
    setQueryParams({
      pagination: {
        page: nextState.pageIndex + 1,
        pageSize: nextState.pageSize
      }
    });
  };

  const handleSortChange = (updater: any) => {
    const nextState = updater(sorting);

    fetchFundRecords(currentFund?.id || '', {
      ...queryParams,
      sort: {
        field: nextState[0].id,
        order: nextState[0].desc ? 'desc' : 'asc'
      }
    });

    setSorting(nextState);
    setQueryParams({
      sort: {
        field: nextState[0].id,
        order: nextState[0].desc ? 'desc' : 'asc'
      }
    });
  };

  const handleFilterChange = async (updater: any) => {
    const nextState = updater(columnFilters);

    if (!nextState[0]?.value) {
      fetchFundRecords(currentFund?.id || '', {
        ...queryParams,
        search: ''
      });
    }

    setQueryParams({
      search: nextState[0]?.value
    });

    setColumnFilters(nextState);
  };

  const table = useReactTable({
    data: fundRecords || [],
    pageCount: metaData.totalPages || -1,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortChange,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: handleFilterChange,
    state: {
      sorting,
      columnFilters,
      pagination,
      columnVisibility
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true
  });

  return (
    <div className="space-y-1overflow-auto w-full pt-3">
      <DataTableToolbar table={table} search={searchField} filterFields={[]}>
        <FundRecordTableToolbarActions table={table} />
      </DataTableToolbar>

      <DataTable table={table} />
    </div>
  );
}
