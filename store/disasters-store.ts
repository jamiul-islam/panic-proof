import { create } from 'zustand';
import { DisasterInfo } from '@/types';
import { disasterInfo as mockDisasterInfo } from '@/mocks/disasters';

interface DisastersState {
  disasters: DisasterInfo[];
  fetchDisasters: () => void;
  getDisasterByType: (type: string) => DisasterInfo | undefined;
}

export const useDisastersStore = create<DisastersState>()((set, get) => ({
  disasters: [],
  
  fetchDisasters: () => {
    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    set({ disasters: mockDisasterInfo });
  },
  
  getDisasterByType: (type) => {
    return get().disasters.find(disaster => disaster.type === type);
  }
}));