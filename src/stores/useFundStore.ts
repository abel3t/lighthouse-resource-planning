import { Fund } from '@prisma/client';
import { create } from 'zustand';

import { client } from '@/lib/client';

export interface FundStore {
  funds: Fund[];
  currentFund: Fund | null;
  setCurrentFund: (fund: Fund) => void;
  setFunds: (funds: Fund[]) => void;
  fetchFunds: () => void;
}

const useFundStore = create<FundStore>((set) => ({
  funds: [],
  currentFund: null,
  setCurrentFund: (fund: Fund) => set({ currentFund: fund }),
  setFunds: (funds: Fund[]) => set({ funds }),
  fetchFunds: async () => {
    const funds = await client.get('/funds').then((res) => res.data);

    if (funds?.length) {
      set((state) => {
        if (state.currentFund) {
          return state;
        }
        return { ...state, currentFund: funds[0] };
      });

      set({ funds: funds });
    }
  }
}));

export default useFundStore;
