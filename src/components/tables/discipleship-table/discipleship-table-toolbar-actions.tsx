// import { type Task } from "@/db/schema"
import { type Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';

import { CreateDiscipleshipDialog } from './create-discipleship-record';

// import { CreateTaskDialog } from "./create-task-dialog"
// import { DeleteTasksDialog } from "./delete-tasks-dialog"

interface TasksTableToolbarActionsProps {
  table: Table<any>;
}

export function MemberTableToolbarActions({ table }: TasksTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button>Delete</Button>
      ) : // <DeleteTasksDialog
      //   tasks={table.getFilteredSelectedRowModel().rows}
      //   onSuccess={() => table.toggleAllPageRowsSelected(false)}
      // />
      null}

      <CreateDiscipleshipDialog />
    </div>
  );
}
