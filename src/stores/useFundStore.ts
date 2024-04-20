import { Fund } from '@prisma/client';
import axios from 'axios';
import { toast } from 'sonner';
import { create } from 'zustand';

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
    const funds = await axios.get('/api/funds').then((res) => res.data);

    if (funds?.length) {
      set({ currentFund: funds[0] });
      set({ funds: funds });
    }
  }
}));

export default useFundStore;
