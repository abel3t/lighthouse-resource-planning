import Funds from '@/components/custom/funds';
import FundRecordTable from '@/components/tables/fund-record-table';

export default async function MemberPage() {
  return (
    <div>
      <Funds />
      <FundRecordTable />
    </div>
  );
}
