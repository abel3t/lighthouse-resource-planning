'use client';

import useFundRecordStore from '@/stores/useFundRecordStore';
import useMemberStore from '@/stores/useMemberStore';
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
import { Toaster, toast } from 'sonner';

import { DataTable } from '@/components/custom/data-table';
import { DataTableToolbar } from '@/components/custom/data-table/data-table-toolbar';
import { Button } from '@/components/ui/button';

import { filterFields, getColumns } from './member-table-columns';
import { MemberTableToolbarActions } from './member-table-toolbar-actions';

export default function MemberTable() {
  const members = useMemberStore((state) => state.members);
  const fetchMembers = useMemberStore((state) => state.fetchMembers);

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo(() => getColumns(), []);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const queryParams = useMemberStore((state) => state.queryParams);
  const setQueryParams = useFundRecordStore((state) => state.setQueryParams);

  const debouncedSearch = useDebounce(queryParams, 300);

  useEffect(() => {
    fetchMembers({});
  }, []);

  useEffect(() => {
    console.log('change', debouncedSearch.search);
    fetchMembers(debouncedSearch);
    console.log(members);
  }, [debouncedSearch.search]);

  const handlePaginationChange = (updater: any) => {
    const nextState = updater(pagination);

    fetchMembers({
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

    fetchMembers({
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
      fetchMembers({
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
    data: members || [],
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
    <div className="w-full space-y-2.5 overflow-auto">
      <DataTableToolbar table={table} filterFields={filterFields}>
        <MemberTableToolbarActions table={table} />
      </DataTableToolbar>

      <DataTable table={table} />
    </div>
  );
}
