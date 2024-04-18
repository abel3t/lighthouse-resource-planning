import Funds from '@/components/custom/funds';
import FundRecordTable from '@/components/tables/fund-record-table';

import { getFundRecords, getFunds, getMembers } from '@/lib/api';

export default async function MemberPage() {
  return (
    <div>
      <Funds />
      <FundRecordTable promiseMembers={getMembers({})} />
    </div>
  );
}
