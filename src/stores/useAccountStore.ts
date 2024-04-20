import { Account } from '@prisma/client';
import { create } from 'zustand';

import { client } from '@/lib/client';

export interface AccountStore {
  myAccount: Account | null;
  accounts: Account[];
  fetchAccounts: () => void;
  setMyAccount: (account: Account) => void;
}

const useAccountStore = create<AccountStore>((set) => ({
  myAccount: null,
  accounts: [],
  fetchAccounts: async () => {
    const accounts = await client.get('/accounts').then((res) => res.data);
    set({ accounts: accounts || [] });
  },
  setMyAccount: (account: Account) => {
    set({ myAccount: account });
  }
}));

export default useAccountStore;
