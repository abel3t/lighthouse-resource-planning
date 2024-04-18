import { SearchParams } from '@/types';

import MemberTable from '@/components/pages/member-table';

import { getMembers } from '@/lib/api';

export interface IndexPageProps {
  searchParams: SearchParams;
}

export default async function MemberPage({ searchParams }: IndexPageProps) {
  const data = getMembers(searchParams);

  console.log('searchParams', searchParams);
  return (
    <div>
      <MemberTable />
    </div>
  );
}
