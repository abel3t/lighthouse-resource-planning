import Funds from '@/components/custom/funds';
import FundRecordTable from '@/components/pages/fund-record-table';

import { getFundRecords, getFunds, getMembers } from '@/lib/api';

export default async function MemberPage() {
  const funds = await getFunds();
  return (
    <div>
      <Funds funds={funds || []} />
      <FundRecordTable promiseData={getFundRecords()} promiseMembers={getMembers({})} />;
    </div>
  );
}
