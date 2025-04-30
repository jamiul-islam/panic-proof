import { create } from 'zustand';
import { Resource } from '@/types';
import { resources as mockResources } from '@/mocks/resources';

interface ResourcesState {
  resources: Resource[];
  fetchResources: () => void;
  getResourcesByCategory: (category: string) => Resource[];
  getResourcesByDisasterType: (disasterType: string) => Resource[];
  searchResources: (query: string) => Resource[];
}

export const useResourcesStore = create<ResourcesState>()((set, get) => ({
  resources: [],
  
  fetchResources: () => {
    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    set({ resources: mockResources });
  },
  
  getResourcesByCategory: (category) => {
    return get().resources.filter(resource => resource.category === category);
  },
  
  getResourcesByDisasterType: (disasterType) => {
    return get().resources.filter(resource => 
      resource.disasterTypes.includes(disasterType as any)
    );
  },
  
  searchResources: (query) => {
    const lowercaseQuery = query.toLowerCase();
    return get().resources.filter(resource => 
      resource.title.toLowerCase().includes(lowercaseQuery) ||
      resource.description.toLowerCase().includes(lowercaseQuery) ||
      resource.category.toLowerCase().includes(lowercaseQuery)
    );
  }
}));