// import { type Task } from "@/db/schema"
import { Button } from "@/components/ui/button";
import { type Table } from "@tanstack/react-table";
import { CreateFundRecordDialog } from "./create-record";

// import { CreateTaskDialog } from "./create-task-dialog"
// import { DeleteTasksDialog } from "./delete-tasks-dialog"

interface TasksTableToolbarActionsProps {
  table: Table<any>;
  members: any[];
}

export function FaithProjectTableToolbarActions({
  table,
  members,
}: TasksTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button>Delete</Button>
      ) : // <DeleteTasksDialog
      //   tasks={table.getFilteredSelectedRowModel().rows}
      //   onSuccess={() => table.toggleAllPageRowsSelected(false)}
      // />
      null}

      <CreateFundRecordDialog members={members} />
    </div>
  );
}
