import { Person } from '@prisma/client';
import { create } from 'zustand';

import { client } from '@/lib/client';

export interface PersonStore {
  people: Person[];
  fetchPeople: () => void;
}

const usePersonStore = create<PersonStore>((set) => ({
  people: [],
  fetchPeople: async () => {
    const people = await client.get('/people').then((res) => res.data);
    set({ people });
  }
}));

export default usePersonStore;
