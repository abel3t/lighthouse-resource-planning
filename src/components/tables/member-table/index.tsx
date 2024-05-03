'use client';

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
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { DataTable } from '@/components/custom/data-table';
import { DataTableToolbar } from '@/components/custom/data-table/data-table-toolbar';

import { getColumns, searchField } from './member-table-columns';
import { MemberTableToolbarActions } from './member-table-toolbar-actions';

export default function MemberTable() {
  const metadata = useMemberStore((state) => state.metadata);
  const members = useMemberStore((state) => state.members);
  const fetchMembers = useMemberStore((state) => state.fetchMembers);
  const t = useTranslations();

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo(() => getColumns(t), []);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ id: false });

  const queryParams = useMemberStore((state) => state.queryParams);
  const setQueryParams = useMemberStore((state) => state.setQueryParams);

  const debouncedSearch = useDebounce(queryParams, 300);

  useEffect(() => {
    fetchMembers(debouncedSearch);
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
    pageCount: metadata.totalPages || -1,
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
    <div className="space-y-1overflow-auto w-full">
      <DataTableToolbar table={table} search={searchField} filterFields={[]}>
        <MemberTableToolbarActions table={table} />
      </DataTableToolbar>

      <DataTable table={table} />
    </div>
  );
}
