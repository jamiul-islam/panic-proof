import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from '@/types';
import { alerts as mockAlerts } from '@/mocks/alerts';

interface AlertsState {
  alerts: Alert[];
  viewedAlerts: string[];
  fetchAlerts: () => void;
  markAlertAsViewed: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  getActiveAlerts: () => Alert[];
  getUnviewedAlerts: () => Alert[];
  clearPersistedState: () => Promise<void>;
}

export const useAlertsStore = create<AlertsState>()(
  persist(
    (set, get) => ({
      alerts: [],
      viewedAlerts: [],
      
      fetchAlerts: () => {
        // In a real app, this would fetch from an API
        // For now, we'll use mock data
        set({ alerts: mockAlerts });
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
        return alerts.filter(alert => alert.isActive);
      },
      
      getUnviewedAlerts: () => {
        const { alerts, viewedAlerts } = get();
        return alerts.filter(
          alert => alert.isActive && !viewedAlerts.includes(alert.id)
        );
      },
      
      clearPersistedState: async () => {
        await AsyncStorage.removeItem('alerts-storage');
        set({ alerts: [], viewedAlerts: [] });
      }
    }),
    {
      name: 'alerts-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ viewedAlerts: state.viewedAlerts }),
    }
  )
);