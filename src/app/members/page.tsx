import { SearchParams } from '@/types';
import { Phone } from 'lucide-react';

import { getMembers } from '@/lib/api';

import { TasksTable } from '../../components/pages/member-table';
import ListMembers from './list';

export interface IndexPageProps {
  searchParams: SearchParams;
}

export default async function MemberPage({ searchParams }: IndexPageProps) {
  const data = getMembers(searchParams);

  console.log('searchParams', searchParams);
  return (
    <div>
      <TasksTable tasksPromise={data} />
    </div>
  );
}
