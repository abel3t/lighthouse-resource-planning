import { Phone } from "lucide-react";
import ListMembers from "./list";
import { TasksTable } from "./table";
import { SearchParams } from "@/types";
import { getMembers } from "@/lib/api";

export interface IndexPageProps {
  searchParams: SearchParams
}

export default async function MemberPage({ searchParams }: IndexPageProps) {
  const data = getMembers(searchParams);

  console.log('searchParams', searchParams)
  return (
    <div>
      <TasksTable tasksPromise={data} />
    </div>
  )
}