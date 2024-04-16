
"use client"

import * as React from "react"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "./index"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { getColumns } from "@/app/members/tasks-table-columns"
import { TasksTableToolbarActions } from "@/app/members/tasks-table-toolbar-actions"


interface TasksTableProps {
  tasksPromise:any
}

export function TasksTable({ tasksPromise }: TasksTableProps) {

  // Learn more about React.use here: https://react.dev/reference/react/use
  const { data, pageCount } = React.use(tasksPromise)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), [])

  const { table } = useDataTable({
    data,
    columns,
    pageCount
  })

  return (
    <div className="w-full space-y-2.5 overflow-auto">
        <DataTableToolbar table={table} filterFields={[]}>
          <TasksTableToolbarActions table={table} />
        </DataTableToolbar>
      <DataTable
        table={table}
      />
    </div>
  )
}
