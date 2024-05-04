'use client';

import { type Table } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { CreateDiscipleshipDialog } from './create-discipleship-record';
import DeleteDiscipleshipDialog from './delete-dialog';

interface TasksTableToolbarActionsProps {
  table: Table<any>;
}

export function MemberTableToolbarActions({ table }: TasksTableToolbarActionsProps) {
  const t = useTranslations();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <div>
          <Button onClick={() => setShowDeleteDialog(true)} variant="destructive">
            {t('delete')}
          </Button>

          <DeleteDiscipleshipDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            discipleshipList={table.getFilteredSelectedRowModel().rows}
            onSuccess={() => table.toggleAllPageRowsSelected(false)}
          />
        </div>
      )}

      <CreateDiscipleshipDialog />
    </div>
  );
}
