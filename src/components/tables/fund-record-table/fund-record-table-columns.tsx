'use client';

import type { DataTableFilterField } from '@/types';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type ColumnDef } from '@tanstack/react-table';
import * as React from 'react';

import { DataTableColumnHeader } from '@/components/custom/data-table/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { cn } from '@/lib/utils';

export const searchField = {
  name: 'contributorName',
  placeholder: 'search_giver'
};

export const filterFields: DataTableFilterField<any>[] = [
  {
    label: 'Name',
    value: 'name',
    placeholder: 'Filter name...'
  }
];

export function getColumns(t: Function): ColumnDef<any>[] {
  const updateTask = async (data: any) => {
    console.log('update task', data);
  };
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'id',
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      enableHiding: false,
      enableSorting: false
    },
    {
      accessorKey: 'date',
      meta: t('date'),
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('date')} />,
      cell: ({ row }) => {
        const date = new Date(row.getValue('date'));

        return (
          <div className="w-20">
            {new Intl.DateTimeFormat('vi-VN', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(date)}
          </div>
        );
      },
      enableSorting: true
    },
    {
      accessorKey: 'contributorName',
      meta: t('giver'),
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('giver')} />,
      cell: ({ row }) => {
        return <div className="flex space-x-2">{row.getValue('contributorName')}</div>;
      },
      enableSorting: false
    },
    {
      accessorKey: 'description',
      meta: t('note'),
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('note')} />,
      cell: ({ row }) => {
        return <div className="flex space-x-2">{row.getValue('description')}</div>;
      },
      enableSorting: false
    },
    {
      accessorKey: 'amount',
      meta: t('amount'),
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('amount')} />,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount')) || 0;

        return (
          <div className="flex w-[6.25rem] items-center">
            <span className={cn('font-bold capitalize', amount > 0 ? 'text-green-600' : 'text-red-600')}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
      enableSorting: true
    },
    {
      id: 'actions',
      cell: function Cell({ row, table }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition();
        const [showUpdateTaskSheet, setShowUpdateTaskSheet] = React.useState(false);
        const [showDeleteTaskDialog, setShowDeleteTaskDialog] = React.useState(false);

        return (
          <>
            {/* <UpdateTaskSheet
              open={showUpdateTaskSheet}
              onOpenChange={setShowUpdateTaskSheet}
              task={row.original}
            />
            <DeleteTasksDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              tasks={[row]}
              showTrigger={false}
            /> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onSelect={() => setShowUpdateTaskSheet(true)}>{t('edit')}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setShowDeleteTaskDialog(true)}>
                  {t('delete')}
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      }
    }
  ];
}
