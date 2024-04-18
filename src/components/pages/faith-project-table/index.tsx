'use client';

import * as React from 'react';

import { DataTable } from '@/components/custom/data-table';
import { DataTableToolbar } from '@/components/custom/data-table/data-table-toolbar';

import { useDataTable } from '@/hooks/use-data-table';

import { filterFields, getColumns } from './tasks-table-columns';
import { FaithProjectTableToolbarActions } from './tasks-table-toolbar-actions';

interface TableProps {
  promiseData: any;
  promiseMembers: any;
}

export default function FaithProjectTable({ promiseData, promiseMembers }: TableProps) {
  // Learn more about React.use here: https://react.dev/reference/react/use
  const { data, pageCount } = React.use(promiseData);
  const { data: members } = React.use(promiseMembers);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), []);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
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
