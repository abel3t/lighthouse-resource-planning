'use client';

import useFundStore from '@/stores/useFundStore';
import { Fund } from '@prisma/client';
import { WalletIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function Funds({ funds }: { funds: Fund[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {funds.map((fund) => (
        <FundCard key={fund.id} fund={fund} />
      ))}
    </div>
  );
}

const FundCard = ({ className, fund }: { className?: string; fund: Fund }) => {
  const currentFund = useFundStore((state) => state.currentFund);
  const setCurrentFund = useFundStore((state) => state.setCurrentFund);

  const handleSelect = () => {
    console.log('fund ne', fund);
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
        <p className="text-gray-600">{fund.name}</p>
        <p className="text-secondary">{fund.amount || 0}</p>
      </div>
    </div>
  );
};
