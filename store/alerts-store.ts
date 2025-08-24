import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from '@/types';
import { supabase } from '@/lib/supabase';

interface AlertsState {
  alerts: Alert[];
  viewedAlerts: string[];
  isLoading: boolean;
  error: string | null;
  isSubscribed: boolean;
  fetchAlerts: () => Promise<void>;
  subscribeToAlerts: () => void;
  unsubscribeFromAlerts: () => void;
  markAlertAsViewed: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  getActiveAlerts: () => Alert[];
  getUnviewedAlerts: () => Alert[];
  clearPersistedState: () => Promise<void>;
  clearViewedAlerts: () => void;
}

// Helper function to convert Supabase alert to app Alert type
function convertSupabaseAlert(supabaseAlert: any): Alert {
  return {
    id: supabaseAlert.id,
    type: supabaseAlert.type,
    title: supabaseAlert.title,
    description: supabaseAlert.description,
    level: supabaseAlert.level,
    location: supabaseAlert.location,
    date: supabaseAlert.date,
    isActive: supabaseAlert.is_active ?? true,
    source: supabaseAlert.source,
    instructions: Array.isArray(supabaseAlert.instructions) ? supabaseAlert.instructions : undefined,
  };
}

let alertsSubscription: any = null;

export const useAlertsStore = create<AlertsState>()(
  persist(
    (set, get) => ({
      alerts: [],
      viewedAlerts: [],
      isLoading: false,
      error: null,
      isSubscribed: false,
      
      fetchAlerts: async () => {
        console.log('🔄 Fetching alerts from Supabase...');
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase
            .from('alerts')
            .select('*')
            .order('date', { ascending: false });
          
          if (error) {
            console.error('❌ Error fetching alerts:', error);
            set({ error: error.message, isLoading: false });
            return;
          }
          
          const convertedAlerts = data?.map(convertSupabaseAlert) || [];
          console.log(`✅ Fetched ${convertedAlerts.length} alerts from Supabase`);
          
          set({ 
            alerts: convertedAlerts, 
            isLoading: false, 
            error: null 
          });
        } catch (err) {
          console.error('❌ Failed to fetch alerts:', err);
          set({ 
            error: err instanceof Error ? err.message : 'Failed to fetch alerts', 
            isLoading: false 
          });
        }
      },

      subscribeToAlerts: () => {
        const { isSubscribed } = get();
        if (isSubscribed || alertsSubscription) {
          console.log('⚠️ Already subscribed to alerts');
          return; // Already subscribed
        }

        console.log('🔔 Setting up real-time alerts subscription...');
        
        alertsSubscription = supabase
          .channel('alerts-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'alerts',
            },
            (payload) => {
              console.log('🔔 Real-time alert update received:', payload);
              
              if (payload.eventType === 'INSERT') {
                const newAlert = convertSupabaseAlert(payload.new);
                console.log('➕ Adding new alert:', newAlert.title);
                set((state) => ({
                  alerts: [newAlert, ...state.alerts],
                }));
              } else if (payload.eventType === 'UPDATE') {
                const updatedAlert = convertSupabaseAlert(payload.new);
                console.log('🔄 Updating alert:', updatedAlert.title);
                set((state) => ({
                  alerts: state.alerts.map(alert =>
                    alert.id === updatedAlert.id ? updatedAlert : alert
                  ),
                }));
              } else if (payload.eventType === 'DELETE') {
                console.log('🗑️ Deleting alert:', payload.old.id);
                set((state) => ({
                  alerts: state.alerts.filter(alert => alert.id !== payload.old.id),
                }));
              }
            }
          )
          .subscribe((status) => {
            console.log('📡 Subscription status:', status);
            if (status === 'SUBSCRIBED') {
              console.log('✅ Successfully subscribed to alerts real-time updates');
            } else if (status === 'CHANNEL_ERROR') {
              console.error('❌ Failed to subscribe to alerts real-time updates');
            }
          });

        set({ isSubscribed: true });
      },

      unsubscribeFromAlerts: () => {
        if (alertsSubscription) {
          console.log('🔕 Unsubscribing from alerts...');
          supabase.removeChannel(alertsSubscription);
          alertsSubscription = null;
        }
        set({ isSubscribed: false });
      },
      
      markAlertAsViewed: (alertId) => set((state) => ({
        viewedAlerts: state.viewedAlerts.includes(alertId) 
          ? state.viewedAlerts 
          : [...state.viewedAlerts, alertId]
      })),
      
      dismissAlert: (alertId) => set((state) => ({
        alerts: state.alerts.map(alert => 
          alert.id === alertId 
            ? { ...alert, isActive: false } 
            : alert
        )
      })),
      
      getActiveAlerts: () => {
        const { alerts } = get();
        const activeAlerts = alerts.filter(alert => alert.isActive);
        console.log('🔍 [AlertsStore] Active alerts check:', { total: alerts.length, active: activeAlerts.length });
        return activeAlerts;
      },
      
      getUnviewedAlerts: () => {
        const { alerts, viewedAlerts } = get();
        const unviewedAlerts = alerts.filter(
          alert => alert.isActive && !viewedAlerts.includes(alert.id)
        );
        console.log('🔍 [AlertsStore] Unviewed alerts check:', { 
          total: alerts.length, 
          active: alerts.filter(alert => alert.isActive).length,
          viewed: viewedAlerts.length,
          unviewed: unviewedAlerts.length,
          viewedIds: viewedAlerts
        });
        return unviewedAlerts;
      },
      
      clearPersistedState: async () => {
        // Unsubscribe before clearing
        const { unsubscribeFromAlerts } = get();
        unsubscribeFromAlerts();
        
        await AsyncStorage.removeItem('alerts-storage');
        set({ alerts: [], viewedAlerts: [], isLoading: false, error: null, isSubscribed: false });
      },
      
      // Debug function to reset viewed alerts
      clearViewedAlerts: () => {
        console.log('🔄 [AlertsStore] Clearing viewed alerts for debugging');
        set({ viewedAlerts: [] });
      }
    }),
    {
      name: 'alerts-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
          // Handle migration from older versions
          if (version === 0) {
            // If migrating from version 0, reset to initial state
            return {
              alerts: [],
              viewedAlerts: [],
              isLoading: false,
              error: null,
              isSubscribed: false,
            };
          }
          return persistedState;
        },
      partialize: (state) => ({ viewedAlerts: state.viewedAlerts }),
    }
  )
);