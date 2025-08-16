import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, EmergencyContact, Badge, KitItem, SavedLocation, CustomChecklist, ChecklistItem } from '@/types';

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
  addCustomChecklist: (checklist: CustomChecklist) => void;
  updateCustomChecklist: (checklistId: string, updates: Partial<CustomChecklist>) => void;
  removeCustomChecklist: (checklistId: string) => void;
  toggleChecklistItem: (checklistId: string, itemId: string) => void;
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
  customChecklists: [
    {
      id: 'demo-1',
      title: 'Emergency Supply Kit',
      description: 'Essential items to keep ready for any emergency',
      category: 'supplies',
      points: 80,
      items: [
        { id: '1', text: 'Water - 1 gallon per person per day (3-day supply)', isCompleted: true },
        { id: '2', text: 'Non-perishable food (3-day supply)', isCompleted: true },
        { id: '3', text: 'Battery-powered or hand crank radio', isCompleted: false },
        { id: '4', text: 'Flashlight', isCompleted: false },
        { id: '5', text: 'First aid kit', isCompleted: true },
        { id: '6', text: 'Extra batteries', isCompleted: false },
      ],
      isCompleted: false,
      imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      title: 'Family Communication Plan',
      description: 'Plan for staying connected with family during emergencies',
      category: 'planning',
      points: 60,
      items: [
        { id: '1', text: 'Create contact list with phone numbers', isCompleted: true },
        { id: '2', text: 'Choose out-of-state contact person', isCompleted: true },
        { id: '3', text: 'Identify meeting locations', isCompleted: false },
        { id: '4', text: 'Make copies of important documents', isCompleted: false },
      ],
      isCompleted: false,
      imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
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
    (set, get) => ({
      profile: initialProfile, // Initialize with demo data
      isOnboarded: true, // Set to true for testing
      
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
      
      addCustomChecklist: (checklist) => set((state) => {
        if (!state.profile) return { profile: null };
        return {
          profile: {
            ...state.profile,
            customChecklists: [...(state.profile.customChecklists || []), checklist]
          }
        };
      }),
      
      updateCustomChecklist: (checklistId, updates) => set((state) => {
        if (!state.profile) return { profile: null };
        const updatedChecklist = { ...updates, updatedAt: new Date().toISOString() };
        return {
          profile: {
            ...state.profile,
            customChecklists: (state.profile.customChecklists || []).map((checklist) =>
              checklist.id === checklistId ? { ...checklist, ...updatedChecklist } : checklist
            )
          }
        };
      }),
      
      removeCustomChecklist: (checklistId) => set((state) => {
        if (!state.profile) return { profile: null };
        return {
          profile: {
            ...state.profile,
            customChecklists: (state.profile.customChecklists || []).filter((checklist) => checklist.id !== checklistId)
          }
        };
      }),
      
      toggleChecklistItem: (checklistId, itemId) => set((state) => {
        if (!state.profile) return { profile: null };
        
        const currentChecklist = (state.profile.customChecklists || []).find(c => c.id === checklistId);
        if (!currentChecklist) return { profile: state.profile };
        
        const wasCompleted = currentChecklist.isCompleted;
        
        return {
          profile: {
            ...state.profile,
            customChecklists: (state.profile.customChecklists || []).map((checklist) => {
              if (checklist.id === checklistId) {
                const updatedItems = checklist.items.map((item) =>
                  item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
                );
                const isCompleted = updatedItems.every((item) => item.isCompleted);
                
                // Calculate points based on checklist completion
                const checklistPoints = checklist.points || (checklist.items.length * 10); // Default: 10 points per item
                let newPoints = state.profile!.points;
                
                // Award points when checklist becomes completed
                if (!wasCompleted && isCompleted) {
                  newPoints += checklistPoints;
                }
                // Remove points when checklist becomes uncompleted
                else if (wasCompleted && !isCompleted) {
                  newPoints = Math.max(0, newPoints - checklistPoints);
                }
                
                // Update user points and level if this checklist's completion status changed
                if (wasCompleted !== isCompleted) {
                  const newLevel = Math.floor(newPoints / 100) + 1;
                  state.profile!.points = newPoints;
                  state.profile!.level = newLevel;
                }
                
                return {
                  ...checklist,
                  items: updatedItems,
                  isCompleted,
                  updatedAt: new Date().toISOString()
                };
              }
              return checklist;
            })
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