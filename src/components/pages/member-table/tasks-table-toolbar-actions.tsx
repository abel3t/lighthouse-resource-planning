// import { type Task } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { type Table } from "@tanstack/react-table"

// import { CreateTaskDialog } from "./create-task-dialog"
// import { DeleteTasksDialog } from "./delete-tasks-dialog"

interface TasksTableToolbarActionsProps {
  table: Table<any>
}

export function TasksTableToolbarActions({
  table,
}: TasksTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button>
          Delete
        </Button>
        // <DeleteTasksDialog
        //   tasks={table.getFilteredSelectedRowModel().rows}
        //   onSuccess={() => table.toggleAllPageRowsSelected(false)}
        // />
      ) : null}

      <Button>
        Create
      </Button>
      {/* <CreateTaskDialog prevTasks={table.getFilteredRowModel().rows} /> */}
      {/**
       * Other actions can be added here.
       * For example, export, import, etc.
       */}
    </div>
  )
}