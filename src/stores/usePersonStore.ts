import { Person } from '@prisma/client';
import axios from 'axios';
import { create } from 'zustand';

export interface PersonStore {
  people: Person[];
  fetchPeople: () => void;
}

const usePersonStore = create<PersonStore>((set) => ({
  people: [],
  fetchPeople: async () => {
    const people = await axios.get('/api/people').then((res) => res.data);
    set({ people });
  }
}));

export default usePersonStore;
