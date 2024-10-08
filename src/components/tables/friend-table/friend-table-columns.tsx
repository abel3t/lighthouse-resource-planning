'use client';

import { FriendTypeColor } from '@/constant';
import { FriendType } from '@/enums';
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

import DeleteFriendsDialog from './delete-dialog';

export const searchField = {
  name: 'name',
  placeholder: 'search_friend'
};

export const filterFields: DataTableFilterField<any>[] = [
  {
    label: 'Name',
    value: 'name',
    placeholder: 'Filter name...'
  }
];

export function getColumns(t: Function): ColumnDef<any>[] {
  const router = useRouter();
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
      accessorKey: 'type',
      meta: t('friend_type'),
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('friend_type')} />,
      cell: ({ row }) => {
        const type = row.getValue('type') as FriendType;
        return (
          <div className="flex space-x-2">
            <Badge className="capitalize" style={{ backgroundColor: FriendTypeColor[type] }}>
              {t(type.toLowerCase())}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
      enableSorting: false
    },
    {
      id: 'actions',
      cell: function Cell({ row, table }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition();
        const [showUpdateTaskSheet, setShowUpdateTaskSheet] = React.useState(false);
        const [showDeleteFriendDialog, setShowDeleteFriendDialog] = React.useState(false);
        const selectedRows = table.getFilteredSelectedRowModel().rows.length;

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

            <DeleteFriendsDialog
              open={showDeleteFriendDialog}
              onOpenChange={setShowDeleteFriendDialog}
              friends={[row]}
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
                <DropdownMenuItem onSelect={() => router.push(`/friends/${row.getValue('id')}`)}>
                  {t('view')}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setShowDeleteFriendDialog(true)}>
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
