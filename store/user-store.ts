import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, EmergencyContact, Badge, KitItem, SavedLocation } from '@/types';

interface UserState {
  profile: UserProfile | null;
  isOnboarded: boolean;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addEmergencyContact: (contact: EmergencyContact) => void;
  removeEmergencyContact: (contactId: string) => void;
  updateEmergencyContact: (contactId: string, updates: Partial<EmergencyContact>) => void;
  completeTask: (taskId: string, points: number) => void;
  uncompleteTask: (taskId: string, points: number) => void;
  addBadge: (badge: Badge) => void;
  addKitItem: (item: KitItem) => void;
  updateKitItem: (itemId: string, updates: Partial<KitItem>) => void;
  removeKitItem: (itemId: string) => void;
  addSavedLocation: (location: SavedLocation) => void;
  updateSavedLocation: (locationId: string, updates: Partial<SavedLocation>) => void;
  removeSavedLocation: (locationId: string) => void;
  setOnboarded: (value: boolean) => void;
  reset: () => void;
}

const initialProfile: UserProfile = {
  id: "user1",
  name: "",
  location: "",
  householdSize: 1,
  hasPets: false,
  hasChildren: false,
  hasElderly: false,
  hasDisabled: false,
  medicalConditions: [],
  emergencyContacts: [],
  completedTasks: [],
  points: 0,
  level: 1,
  badges: [],
  customKit: [],
  savedLocations: [
    {
      id: '1',
      name: 'Home',
      address: '123 Main Street, London, UK',
      type: 'home',
      isPrimary: true,
    },
    {
      id: '2',
      name: 'Work',
      address: '456 Business Avenue, London, UK',
      type: 'work',
      isPrimary: false,
    },
    {
      id: '3',
      name: 'Parents',
      address: '789 Family Road, Manchester, UK',
      type: 'favorite',
      isPrimary: false,
    },
  ]
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      isOnboarded: false,
      
      setProfile: (profile) => set({ profile }),
      
      updateProfile: (updates) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : initialProfile
      })),
      
      addEmergencyContact: (contact) => set((state) => {
        if (!state.profile) return { profile: null };
        return {
          profile: {
            ...state.profile,
            emergencyContacts: [...state.profile.emergencyContacts, contact]
          }
        };
      }),
      
      removeEmergencyContact: (contactId) => set((state) => {
        if (!state.profile) return { profile: null };
        return {
          profile: {
            ...state.profile,
            emergencyContacts: state.profile.emergencyContacts.filter(
              (contact) => contact.id !== contactId
            )
          }
        };
      }),
      
      updateEmergencyContact: (contactId, updates) => set((state) => {
        if (!state.profile) return { profile: null };
        return {
          profile: {
            ...state.profile,
            emergencyContacts: state.profile.emergencyContacts.map((contact) =>
              contact.id === contactId ? { ...contact, ...updates } : contact
            )
          }
        };
      }),
      
      completeTask: (taskId, points) => set((state) => {
        if (!state.profile) return { profile: null };
        
        // Don't add if already completed
        if (state.profile.completedTasks.includes(taskId)) {
          return { profile: state.profile };
        }
        
        const newPoints = state.profile.points + points;
        const newLevel = Math.floor(newPoints / 100) + 1;
        
        return {
          profile: {
            ...state.profile,
            completedTasks: [...state.profile.completedTasks, taskId],
            points: newPoints,
            level: newLevel
          }
        };
      }),
      
      uncompleteTask: (taskId, points) => set((state) => {
        if (!state.profile) return { profile: null };
        
        // Only subtract if task was completed
        if (!state.profile.completedTasks.includes(taskId)) {
          return { profile: state.profile };
        }
        
        const newPoints = Math.max(0, state.profile.points - points);
        const newLevel = Math.floor(newPoints / 100) + 1;
        
        return {
          profile: {
            ...state.profile,
            completedTasks: state.profile.completedTasks.filter(id => id !== taskId),
            points: newPoints,
            level: newLevel
          }
        };
      }),
      
      addBadge: (badge) => set((state) => {
        if (!state.profile) return { profile: null };
        return {
          profile: {
            ...state.profile,
            badges: [...state.profile.badges, badge]
          }
        };
      }),
      
      addKitItem: (item) => set((state) => {
        if (!state.profile) return { profile: null };
        return {
          profile: {
            ...state.profile,
            customKit: [...state.profile.customKit, item]
          }
        };
      }),
      
      updateKitItem: (itemId, updates) => set((state) => {
        if (!state.profile) return { profile: null };
        return {
          profile: {
            ...state.profile,
            customKit: state.profile.customKit.map((item) =>
              item.id === itemId ? { ...item, ...updates } : item
            )
          }
        };
      }),
      
      removeKitItem: (itemId) => set((state) => {
        if (!state.profile) return { profile: null };
        return {
          profile: {
            ...state.profile,
            customKit: state.profile.customKit.filter((item) => item.id !== itemId)
          }
        };
      }),
      
      addSavedLocation: (location) => set((state) => {
        if (!state.profile) return { profile: null };
        return {
          profile: {
            ...state.profile,
            savedLocations: [...(state.profile.savedLocations || []), location]
          }
        };
      }),
      
      updateSavedLocation: (locationId, updates) => set((state) => {
        if (!state.profile) return { profile: null };
        return {
          profile: {
            ...state.profile,
            savedLocations: (state.profile.savedLocations || []).map((location) =>
              location.id === locationId ? { ...location, ...updates } : location
            )
          }
        };
      }),
      
      removeSavedLocation: (locationId) => set((state) => {
        if (!state.profile) return { profile: null };
        return {
          profile: {
            ...state.profile,
            savedLocations: (state.profile.savedLocations || []).filter((location) => location.id !== locationId)
          }
        };
      }),
      
      setOnboarded: (value) => set({ isOnboarded: value }),
      
      reset: () => set({ profile: null, isOnboarded: false })
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);