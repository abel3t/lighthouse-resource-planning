'use client';

import useFundStore from '@/stores/useFundStore';
import { Fund } from '@prisma/client';
import { PlusIcon, WalletIcon } from 'lucide-react';
import { useEffect } from 'react';

import { cn } from '@/lib/utils';

import { CreateFundDialog } from '../tables/fund-record-table/create-fund';

export default function Funds() {
  const fetchFunds = useFundStore((state) => state.fetchFunds);
  const funds = useFundStore((state) => state.funds);

  useEffect(() => {
    fetchFunds();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2 px-1 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4">
      {funds.map((fund) => (
        <FundCard key={fund.id} fund={fund} />
      ))}

      <CreateFundDialog />
    </div>
  );
}

const FundCard = ({ className, fund }: { className?: string; fund: Fund }) => {
  const currentFund = useFundStore((state) => state.currentFund);
  const setCurrentFund = useFundStore((state) => state.setCurrentFund);

  const handleSelect = () => {
    setCurrentFund(fund);
  };

  return (
    <div
      className={cn(
        'flex h-14 w-full cursor-pointer justify-start rounded-sm font-bold',
        currentFund?.id === fund.id ? 'opacity-100' : 'opacity-90',
        className
      )}
      style={{ backgroundColor: currentFund?.id === fund.id ? fund.color || '#77B6EA' : '#C1C1C1' }}
      onClick={handleSelect}
    >
      <div className="flex flex-none items-center p-2">
        <WalletIcon className="text-secondary" />
      </div>

      <div className="flex flex-1 flex-col p-1 px-2">
        <p className="md:text-md text-sm text-gray-600 lg:text-base">{fund.name}</p>
        <p className="text-secondary">
          <span className={cn('font-bold capitalize', fund.amount > 0 ? 'text-green-600' : 'text-red-600')}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fund.amount)}
          </span>
        </p>
      </div>
    </div>
  );
};
