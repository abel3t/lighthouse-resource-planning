'use client';

import { DiscipleshipProcessColor, NOT_APPLICABLE } from '@/constant';
import { DiscipleshipProcess } from '@/enums';
import type { DataTableFilterField } from '@/types';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { DataTableColumnHeader } from '@/components/custom/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
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

import DeleteMembersDialog from './delete-dialog';

export const searchField = {
  name: 'name',
  placeholder: 'search_member'
};

export const filterFields: DataTableFilterField<any>[] = [
  {
    label: 'Name',
    value: 'name',
    placeholder: 'search_member'
  }
];

export function getColumns(t: Function): ColumnDef<any>[] {
  const updateTask = async (data: any) => {
    console.log('update task', data);
  };

  const router = useRouter();

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
      accessorKey: 'name',
      meta: t('name'),
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('name')} />,
      cell: ({ row }) => {
        return <div className="w-32">{row.getValue('name')}</div>;
      },
      enableSorting: true
    },
    {
      accessorKey: 'phone',
      meta: t('phone'),
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('phone')} />,
      cell: ({ row }) => {
        return <div className="w-32">{row.getValue('phone')}</div>;
      },
      enableSorting: false
    },
    {
      accessorKey: 'discipleshipProcess',
      meta: t('discipleship_process'),
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('discipleship_process')} />,
      cell: ({ row }) => {
        const discipleshipProcess = row.getValue('discipleshipProcess') as DiscipleshipProcess;

        return (
          <div className="flex space-x-2">
            {discipleshipProcess ? (
              <Badge className="capitalize" style={{ backgroundColor: DiscipleshipProcessColor[discipleshipProcess] }}>
                {t(discipleshipProcess.toLowerCase())}
              </Badge>
            ) : (
              NOT_APPLICABLE
            )}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
      enableSorting: false
    },
    {
      accessorKey: 'curatorName',
      meta: t('curator'),
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('curator')} />,
      cell: ({ row }) => {
        return <div className="flex w-32  space-x-2">{row.getValue('curatorName') || NOT_APPLICABLE}</div>;
      },
      enableSorting: false
    },
    {
      id: 'actions',
      cell: function Cell({ row, table }) {
        const selectedRows = table.getFilteredSelectedRowModel().rows.length;

        const [isUpdatePending, startUpdateTransition] = React.useTransition();
        const [showUpdateTaskSheet, setShowUpdateTaskSheet] = React.useState(false);
        const [showDeleteMemberDialog, setShowDeleteMemberDialog] = React.useState(false);

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
            <DeleteMembersDialog
              open={showDeleteMemberDialog}
              onOpenChange={setShowDeleteMemberDialog}
              members={[row]}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={selectedRows > 1}
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onSelect={() => setShowUpdateTaskSheet(true)}>{t('edit')}</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push(`/members/${row.getValue('id')}`)}>
                  {t('view')}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setShowDeleteMemberDialog(true)}>
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
