import { Account, Fund } from '@prisma/client';
import axios from 'axios';
import { create } from 'zustand';

export interface AccountStore {
  myAccount: Account | null;
  accounts: Account[];
  fetchAccount: () => void;
}

const useAccountStore = create<AccountStore>((set) => ({
  myAccount: null,
  accounts: [],
  fetchAccount: async () => {
    const accounts = await axios.get('/api/accounts').then((res) => res.data);
    set({ accounts });
  }
}));

export default useAccountStore;
