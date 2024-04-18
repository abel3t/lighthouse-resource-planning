'use client';

import * as React from 'react';

import { DataTable } from '@/components/custom/data-table';
import { DataTableToolbar } from '@/components/custom/data-table/data-table-toolbar';

import { useDataTable } from '@/hooks/use-data-table';

import { filterFields, getColumns } from './tasks-table-columns';
import { TasksTableToolbarActions } from './tasks-table-toolbar-actions';

interface TasksTableProps {
  tasksPromise: any;
}

export function TasksTable({ tasksPromise }: TasksTableProps) {
  // Learn more about React.use here: https://react.dev/reference/react/use
  const { data, pageCount } = React.use(tasksPromise);

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
        <TasksTableToolbarActions table={table} />
      </DataTableToolbar>

      <DataTable table={table} />
    </div>
  );
}
