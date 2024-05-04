'use client';

import { CarePriorityColor, CarePriorityText, CareTypeColor, CareTypeText } from '@/constant';
import { CarePriority, CareType } from '@/enums';
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

import DeleteCaresDialog from './delete-dialog';

export const searchField = {
  name: 'personName',
  placeholder: 'search_caring_person'
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
      accessorKey: 'date',
      meta: t('care_date'),
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('care_date')} />,
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
      accessorKey: 'personName',
      meta: t('name'),
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('name')} />,
      cell: ({ row }) => {
        return <div className="w-32">{row.getValue('personName')}</div>;
      },
      enableSorting: true
    },
    {
      accessorKey: 'type',
      meta: t('care_type'),
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('care_type')} />,
      cell: ({ row }) => {
        const type = row.getValue('type') as CareType;

        return (
          <div className="flex w-32 space-x-2">
            <Badge style={{ backgroundColor: CareTypeColor[type] }}>{t(CareTypeText[type])}</Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
      enableSorting: false
    },
    {
      accessorKey: 'priority',
      meta: t('care_priority'),
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('care_priority')} />,
      cell: ({ row }) => {
        const priority = row.getValue('priority') as CarePriority;
        return (
          <div className="flex w-32 space-x-2">
            <Badge style={{ backgroundColor: CarePriorityColor[priority] }}>{t(CarePriorityText[priority])}</Badge>
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
        return <div className="w-32">{row.getValue('curatorName')}</div>;
      },
      enableSorting: true,
      enableHiding: false
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition();
        const [showUpdateTaskSheet, setShowUpdateTaskSheet] = React.useState(false);
        const [showDeleteCareDialog, setShowDeleteCareDialog] = React.useState(false);

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

            <DeleteCaresDialog open={showDeleteCareDialog} onOpenChange={setShowDeleteCareDialog} cares={[row]} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onSelect={() => setShowUpdateTaskSheet(true)}>{t('edit')}</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push(`/cares/${row.getValue('id')}`)}>
                  {t('view')}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setShowDeleteCareDialog(true)}>
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
