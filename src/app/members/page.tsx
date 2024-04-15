import { Phone } from "lucide-react";
import ListMembers from "./list";

async function getData(): Promise<any[]> {

  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      name: 'Trần Tâm Tỏ',
      discipleship_process: 'OK',
      curator: 'Abel Tran',
      phone: '+84 123 456 789',
    },
  ]
}

export default async function MemberPage() {
  const data = await getData();
  return (
    <div>
      <ListMembers />
    </div>
  )
}