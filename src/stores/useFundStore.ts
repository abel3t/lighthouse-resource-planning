import { Fund } from '@prisma/client';
import { create } from 'zustand'

export interface FundStore{
  currentFund: Fund | null,
  setCurrentFund: (fund: Fund) => void
}

const useFundStore = create<FundStore>((set) => ({
  currentFund: null,
  setCurrentFund: (fund: Fund) => set({ currentFund: fund }),
}))

export default useFundStore;