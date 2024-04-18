'use client';

import useFundRecordStore from '@/stores/useFundRecordStore';
import { use, useEffect, useMemo } from 'react';

import { DataTable } from '@/components/custom/data-table';
import { DataTableToolbar } from '@/components/custom/data-table/data-table-toolbar';

import { useDataTable } from '@/hooks/use-data-table';

import { filterFields, getColumns } from './fund-record-table-columns';
import { FaithProjectTableToolbarActions } from './fund-record-table-toolbar-actions';

interface TableProps {
  promiseMembers: any;
}

export default function FundRecordTable({ promiseMembers }: TableProps) {
  const { data: members } = use(promiseMembers);
  const fundRecords = useFundRecordStore((state) => state.records);
  const fetchFundRecords = useFundRecordStore((state) => state.fetchRecords);

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo(() => getColumns(), []);

  useEffect(() => {
    fetchFundRecords();
  }, []);

  const { table } = useDataTable({
    data: fundRecords || [],
    columns,
    pageCount: 1,
    filterFields
  });

  return (
    <div className="w-full space-y-2.5 overflow-auto">
      <DataTableToolbar table={table} filterFields={filterFields}>
        <FaithProjectTableToolbarActions table={table} members={members} />
      </DataTableToolbar>

      <DataTable table={table} floatingBar={null} />
    </div>
  );
}
