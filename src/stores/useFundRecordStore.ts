import { Fund } from '@prisma/client';
import axios from 'axios';
import { create } from 'zustand';

export interface FundStore {
  records: Fund[];
  fetchRecords: () => void;
}

const useFundRecordStore = create<FundStore>((set) => ({
  records: [],
  fetchRecords: async () => {
    const records = await axios.get('/api/fund-record').then((res) => res.data);
    if (records?.length) {
      set({ records });
    }
  }
}));

export default useFundRecordStore;
