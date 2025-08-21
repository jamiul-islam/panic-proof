import { create } from 'zustand';
import { Resource } from '@/types';
import { supabase } from '@/lib/supabase';

interface ResourcesState {
  resources: Resource[];
  isLoading: boolean;
  error: string | null;
  isSubscribed: boolean;
  fetchResources: () => Promise<void>;
  subscribeToResources: () => void;
  unsubscribeFromResources: () => void;
  getResourcesByCategory: (category: string) => Resource[];
  getResourcesByDisasterType: (disasterType: string) => Resource[];
  searchResources: (query: string) => Resource[];
}

// Helper function to convert Supabase resource to app Resource type
function convertSupabaseResource(supabaseResource: any): Resource {
  return {
    id: supabaseResource.id,
    title: supabaseResource.title,
    description: supabaseResource.description,
    category: supabaseResource.category,
    contactPhone: supabaseResource.contact_phone || undefined,
    contactEmail: supabaseResource.contact_email || undefined,
    website: supabaseResource.website || undefined,
    address: supabaseResource.address || undefined,
    coordinates: supabaseResource.coordinates || undefined,
    disasterTypes: Array.isArray(supabaseResource.disaster_types) 
      ? supabaseResource.disaster_types 
      : [],
  };
}

let resourcesSubscription: any = null;

export const useResourcesStore = create<ResourcesState>()((set, get) => ({
  resources: [],
  isLoading: false,
  error: null,
  isSubscribed: false,
  
  fetchResources: async () => {
    console.log('🔄 Fetching resources from Supabase...');
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('title', { ascending: true });
      
      if (error) {
        console.error('❌ Error fetching resources:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      const convertedResources = data?.map(convertSupabaseResource) || [];
      console.log(`✅ Fetched ${convertedResources.length} resources from Supabase`);
      
      set({ 
        resources: convertedResources, 
        isLoading: false, 
        error: null 
      });
    } catch (err) {
      console.error('❌ Failed to fetch resources:', err);
      set({ 
        error: err instanceof Error ? err.message : 'Failed to fetch resources', 
        isLoading: false 
      });
    }
  },

  subscribeToResources: () => {
    const { isSubscribed } = get();
    if (isSubscribed || resourcesSubscription) {
      return; // Already subscribed
    }

    console.log('🔔 Setting up real-time resources subscription...');
    
    resourcesSubscription = supabase
      .channel('resources-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'resources',
        },
        (payload) => {
          console.log('🔔 Real-time resource update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newResource = convertSupabaseResource(payload.new);
            set((state) => ({
              resources: [...state.resources, newResource].sort((a, b) => a.title.localeCompare(b.title)),
            }));
          } else if (payload.eventType === 'UPDATE') {
            const updatedResource = convertSupabaseResource(payload.new);
            set((state) => ({
              resources: state.resources.map(resource =>
                resource.id === updatedResource.id ? updatedResource : resource
              ).sort((a, b) => a.title.localeCompare(b.title)),
            }));
          } else if (payload.eventType === 'DELETE') {
            set((state) => ({
              resources: state.resources.filter(resource => resource.id !== payload.old.id),
            }));
          }
        }
      )
      .subscribe();

    set({ isSubscribed: true });
  },

  unsubscribeFromResources: () => {
    if (resourcesSubscription) {
      console.log('🔕 Unsubscribing from resources...');
      supabase.removeChannel(resourcesSubscription);
      resourcesSubscription = null;
    }
    set({ isSubscribed: false });
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