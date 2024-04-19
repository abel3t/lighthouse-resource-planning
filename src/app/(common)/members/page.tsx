import { SearchParams } from '@/types';

import MemberTable from '@/components/tables/member-table';

import { getMembers } from '@/lib/api';

export interface IndexPageProps {
  searchParams: SearchParams;
}

export default async function MemberPage({ searchParams }: IndexPageProps) {
  return (
    <div>
      <MemberTable />
    </div>
  );
}
