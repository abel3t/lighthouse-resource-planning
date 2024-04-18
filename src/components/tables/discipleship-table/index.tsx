'use client';

import useCareStore from '@/stores/useCareStore';
import useDiscipleshipStore from '@/stores/useDiscipleshipStore';
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
import { useEffect, useMemo, useState } from 'react';

import { DataTable } from '@/components/custom/data-table';
import { DataTableToolbar } from '@/components/custom/data-table/data-table-toolbar';

import { filterFields, getColumns } from './discipleship-table-columns';
import { MemberTableToolbarActions } from './discipleship-table-toolbar-actions';

export default function DiscipleshipTable() {
  const discipleshipList = useDiscipleshipStore((state) => state.discipleshipList);
  const fetchDiscipleshipList = useDiscipleshipStore((state) => state.fetchDiscipleshipList);

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo(() => getColumns(), []);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const queryParams = useDiscipleshipStore((state) => state.queryParams);
  const setQueryParams = useDiscipleshipStore((state) => state.setQueryParams);

  const debouncedSearch = useDebounce(queryParams, 300);

  useEffect(() => {
    fetchDiscipleshipList({});
  }, []);

  useEffect(() => {
    fetchDiscipleshipList(debouncedSearch);
  }, [debouncedSearch.search]);

  const handlePaginationChange = (updater: any) => {
    const nextState = updater(pagination);

    fetchDiscipleshipList({
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

    fetchDiscipleshipList({
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
      fetchDiscipleshipList({
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
    data: discipleshipList || [],
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
