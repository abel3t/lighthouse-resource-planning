import FaithProjectTable from '@/components/pages/faith-project-table';

import { getFundRecords, getMembers } from '@/lib/api';

export default function MemberPage() {
  return <FaithProjectTable promiseData={getFundRecords()} promiseMembers={getMembers({})} />;
}
