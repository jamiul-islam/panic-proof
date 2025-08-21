import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, EmergencyContact, Badge, KitItem, SavedLocation, CustomChecklist, ChecklistItem } from '@/types';
import { UserService } from '@/services/user-service';
import { 
  createEmergencyContact, 
  getEmergencyContacts, 
  updateEmergencyContact, 
  deleteEmergencyContact,
  createSavedLocation,
  getSavedLocations,
  updateSavedLocation,
  deleteSavedLocation,
  setPrimaryLocation,
  updateUserProfile as updateUserProfileInSupabase,
  supabase 
} from '@/lib/supabase';

interface UserState {
  profile: UserProfile | null;
  isOnboarded: boolean;
  isLoading: boolean;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (clerkUserId: string, updates: Partial<UserProfile>) => Promise<void>;
  loadUserProfile: (clerkUserId: string) => Promise<void>;
  // Emergency Contacts - now integrated with Supabase
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<void>;
  removeEmergencyContact: (contactId: string) => Promise<void>;
  updateEmergencyContact: (contactId: string, updates: Partial<EmergencyContact>) => Promise<void>;
  loadEmergencyContacts: () => Promise<void>;
  // Saved Locations - now integrated with Supabase
  addSavedLocation: (location: Omit<SavedLocation, 'id'>) => Promise<void>;
  updateSavedLocation: (locationId: string, updates: Partial<SavedLocation>) => Promise<void>;
  removeSavedLocation: (locationId: string) => Promise<void>;
  setPrimaryLocation: (locationId: string) => Promise<void>;
  loadSavedLocations: () => Promise<void>;
  // Other methods remain the same
  completeTask: (taskId: string, points: number) => void;
  uncompleteTask: (taskId: string, points: number) => void;
  addBadge: (badge: Badge) => void;
  addKitItem: (item: KitItem) => void;
  updateKitItem: (itemId: string, updates: Partial<KitItem>) => void;
  removeKitItem: (itemId: string) => void;
  addCustomChecklist: (checklist: CustomChecklist) => void;
  updateCustomChecklist: (checklistId: string, updates: Partial<CustomChecklist>) => void;
  removeCustomChecklist: (checklistId: string) => void;
  toggleChecklistItem: (checklistId: string, itemId: string) => void;
  setOnboarded: (value: boolean) => void;
  reset: () => void;
  clearPersistedState: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null, // Start with null, will be loaded from Supabase
      isOnboarded: false,
      isLoading: false,
      
      setProfile: (profile) => set({ profile, isOnboarded: true }),
      
      loadUserProfile: async (clerkUserId: string) => {
        console.log('🔄 Loading user profile for Clerk ID:', clerkUserId);
        set({ isLoading: true });
        try {
          const userProfile = await UserService.getUserProfile(clerkUserId);
          if (userProfile) {
            console.log('✅ User profile loaded from Supabase:', userProfile.name);
            
            // Load emergency contacts and saved locations from Supabase
            const [emergencyContacts, savedLocations] = await Promise.all([
              getEmergencyContacts(userProfile.id).catch(() => []),
              getSavedLocations(userProfile.id).catch(() => [])
            ]);
            
            // Convert Supabase user data to UserProfile format
            const profile: UserProfile = {
              id: userProfile.id,
              name: userProfile.name || '',
              location: userProfile.location || '',
              householdSize: userProfile.household_size || 1,
              hasPets: userProfile.has_pets || false,
              hasChildren: userProfile.has_children || false,
              hasElderly: userProfile.has_elderly || false,
              hasDisabled: userProfile.has_disabled || false,
              medicalConditions: Array.isArray(userProfile.medical_conditions) ? userProfile.medical_conditions as string[] : [],
              
              // Load real emergency contacts from Supabase
              emergencyContacts: emergencyContacts.map(contact => ({
                id: contact.id,
                name: contact.name,
                phone: contact.phone,
                email: contact.email || undefined,
                relationship: contact.relationship,
                isLocal: contact.is_local || false,
              })),
              
              // Load real saved locations from Supabase
              savedLocations: savedLocations.length > 0 
                ? savedLocations.map(location => ({
                    id: location.id,
                    name: location.name,
                    address: location.address,
                    type: location.type as "home" | "work" | "favorite" | "other",
                    isPrimary: location.is_primary || false,
                    coordinates: location.coordinates as { latitude: number; longitude: number } | undefined,
                  }))
                : [
                    // Default locations if none exist
                    {
                      id: 'default-1',
                      name: 'Home',
                      address: userProfile.location || '123 Main Street, London, UK',
                      type: 'home' as const,
                      isPrimary: true,
                    },
                    {
                      id: 'default-2',
                      name: 'Work',
                      address: '456 Business Avenue, London, UK',
                      type: 'work' as const,
                      isPrimary: false,
                    },
                  ],
              
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
              notificationPreferences: userProfile.notification_preferences ? {
                alertNotifications: (userProfile.notification_preferences as any).alerts || true,
                taskReminders: (userProfile.notification_preferences as any).reminders || true,
                weatherUpdates: (userProfile.notification_preferences as any).weather || true,
                newsUpdates: (userProfile.notification_preferences as any).emergency || true,
                locationAlerts: true,
                pushNotifications: true,
                emailNotifications: true,
              } : undefined,
            };
            set({ profile, isOnboarded: true, isLoading: false });
            console.log('✅ Profile set in store with', emergencyContacts.length, 'contacts and', savedLocations.length, 'locations');
          } else {
            console.log('❌ No user profile found in Supabase');
            set({ profile: null, isOnboarded: false, isLoading: false });
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          set({ isLoading: false });
        }
      },
      
      updateProfile: async (clerkUserId: string, updates: Partial<UserProfile>) => {
        const { profile } = get();
        if (!profile) {
          throw new Error('No user profile found. Please load user profile first.');
        }

        try {
          set({ isLoading: true });
          console.log('🔄 Updating user profile with:', updates);

          // Prepare updates for Supabase (convert frontend format to database format)
          const supabaseUpdates: Record<string, any> = {};
          if (updates.name !== undefined) supabaseUpdates.name = updates.name;
          if (updates.location !== undefined) supabaseUpdates.location = updates.location;
          if (updates.householdSize !== undefined) supabaseUpdates.household_size = updates.householdSize;
          if (updates.hasPets !== undefined) supabaseUpdates.has_pets = updates.hasPets;
          if (updates.hasChildren !== undefined) supabaseUpdates.has_children = updates.hasChildren;
          if (updates.hasElderly !== undefined) supabaseUpdates.has_elderly = updates.hasElderly;
          if (updates.hasDisabled !== undefined) supabaseUpdates.has_disabled = updates.hasDisabled;
          if (updates.medicalConditions !== undefined) supabaseUpdates.medical_conditions = updates.medicalConditions;

          // Update in Supabase
          const updatedUserProfile = await updateUserProfileInSupabase(clerkUserId, supabaseUpdates);
          console.log('✅ User profile updated in Supabase:', updatedUserProfile.name);

          // Update local state with the response from Supabase
          const updatedProfile: UserProfile = {
            ...profile,
            name: updatedUserProfile.name || profile.name,
            location: updatedUserProfile.location || profile.location,
            householdSize: updatedUserProfile.household_size || profile.householdSize,
            hasPets: updatedUserProfile.has_pets || profile.hasPets,
            hasChildren: updatedUserProfile.has_children || profile.hasChildren,
            hasElderly: updatedUserProfile.has_elderly || profile.hasElderly,
            hasDisabled: updatedUserProfile.has_disabled || profile.hasDisabled,
            medicalConditions: Array.isArray(updatedUserProfile.medical_conditions) 
              ? updatedUserProfile.medical_conditions as string[] 
              : profile.medicalConditions,
          };

          set({ profile: updatedProfile, isLoading: false });
          console.log('✅ Local profile state updated successfully');
        } catch (error) {
          console.error('Error updating user profile:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      
      addEmergencyContact: async (contact) => {
        const { profile } = get();
        if (!profile) {
          throw new Error('No user profile found. Please load user profile first.');
        }

        try {
          set({ isLoading: true });
          const newContact = await createEmergencyContact(profile.id, {
            name: contact.name,
            phone: contact.phone,
            email: contact.email || null,
            relationship: contact.relationship,
            is_local: contact.isLocal || false,
          });
          
          // Update local state
          set((state) => {
            if (!state.profile) return { profile: null, isLoading: false };
            return {
              profile: {
                ...state.profile,
                emergencyContacts: [...state.profile.emergencyContacts, {
                  id: newContact.id,
                  name: newContact.name,
                  phone: newContact.phone,
                  email: newContact.email || undefined,
                  relationship: newContact.relationship,
                  isLocal: newContact.is_local || false,
                }]
              },
              isLoading: false
            };
          });
          console.log('✅ Emergency contact added successfully');
        } catch (error) {
          console.error('Error adding emergency contact:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      removeEmergencyContact: async (contactId) => {
        const { profile } = get();
        if (!profile) {
          throw new Error('No user profile found. Please load user profile first.');
        }

        try {
          set({ isLoading: true });
          await deleteEmergencyContact(profile.id, contactId);
          
          // Update local state
          set((state) => {
            if (!state.profile) return { profile: null, isLoading: false };
            return {
              profile: {
                ...state.profile,
                emergencyContacts: state.profile.emergencyContacts.filter(
                  (contact) => contact.id !== contactId
                )
              },
              isLoading: false
            };
          });
          console.log('✅ Emergency contact removed successfully');
        } catch (error) {
          console.error('Error removing emergency contact:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      updateEmergencyContact: async (contactId, updates) => {
        const { profile } = get();
        if (!profile) {
          throw new Error('No user profile found. Please load user profile first.');
        }

        try {
          set({ isLoading: true });
          const updatedContact = await updateEmergencyContact(profile.id, contactId, {
            name: updates.name,
            phone: updates.phone,
            email: updates.email || null,
            relationship: updates.relationship,
            is_local: updates.isLocal,
          });
          
          // Update local state
          set((state) => {
            if (!state.profile) return { profile: null, isLoading: false };
            return {
              profile: {
                ...state.profile,
                emergencyContacts: state.profile.emergencyContacts.map((contact) =>
                  contact.id === contactId ? {
                    id: updatedContact.id,
                    name: updatedContact.name,
                    phone: updatedContact.phone,
                    email: updatedContact.email || undefined,
                    relationship: updatedContact.relationship,
                    isLocal: updatedContact.is_local || false,
                  } : contact
                )
              },
              isLoading: false
            };
          });
          console.log('✅ Emergency contact updated successfully');
        } catch (error) {
          console.error('Error updating emergency contact:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      loadEmergencyContacts: async () => {
        const { profile } = get();
        if (!profile) {
          throw new Error('No user profile found. Please load user profile first.');
        }

        try {
          set({ isLoading: true });
          const contacts = await getEmergencyContacts(profile.id);
          
          // Update local state
          set((state) => {
            if (!state.profile) return { profile: null, isLoading: false };
            return {
              profile: {
                ...state.profile,
                emergencyContacts: contacts.map(contact => ({
                  id: contact.id,
                  name: contact.name,
                  phone: contact.phone,
                  email: contact.email || undefined,
                  relationship: contact.relationship,
                  isLocal: contact.is_local || false,
                }))
              },
              isLoading: false
            };
          });
          console.log('✅ Emergency contacts loaded successfully');
        } catch (error) {
          console.error('Error loading emergency contacts:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      completeTask: (taskId, points) => set((state) => {
        if (!state.profile) return { profile: null };
        
        const newPoints = state.profile.points + points;
        const newLevel = Math.floor(newPoints / 100) + 1;
        
        return {
          profile: {
            ...state.profile,
            points: newPoints,
            level: newLevel
          }
        };
      }),
      
      uncompleteTask: (taskId, points) => set((state) => {
        if (!state.profile) return { profile: null };
        
        const newPoints = Math.max(0, state.profile.points - points);
        const newLevel = Math.floor(newPoints / 100) + 1;
        
        return {
          profile: {
            ...state.profile,
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
      
      addSavedLocation: async (location) => {
        const { profile } = get();
        if (!profile) {
          throw new Error('No user profile found. Please load user profile first.');
        }

        try {
          set({ isLoading: true });
          const newLocation = await createSavedLocation(profile.id, {
            name: location.name,
            address: location.address,
            type: location.type,
            is_primary: location.isPrimary || false,
            coordinates: location.coordinates ? JSON.parse(JSON.stringify(location.coordinates)) : null,
          });
          
          // Update local state
          set((state) => {
            if (!state.profile) return { profile: null, isLoading: false };
            return {
              profile: {
                ...state.profile,
                savedLocations: [...(state.profile.savedLocations || []), {
                  id: newLocation.id,
                  name: newLocation.name,
                  address: newLocation.address,
                  type: newLocation.type as "home" | "work" | "favorite" | "other",
                  isPrimary: newLocation.is_primary || false,
                  coordinates: newLocation.coordinates as { latitude: number; longitude: number } | undefined,
                }]
              },
              isLoading: false
            };
          });
          console.log('✅ Saved location added successfully');
        } catch (error) {
          console.error('Error adding saved location:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      updateSavedLocation: async (locationId, updates) => {
        const { profile } = get();
        if (!profile) {
          throw new Error('No user profile found. Please load user profile first.');
        }

        try {
          set({ isLoading: true });
          const updatedLocation = await updateSavedLocation(profile.id, locationId, {
            name: updates.name,
            address: updates.address,
            type: updates.type,
            is_primary: updates.isPrimary,
            coordinates: updates.coordinates ? JSON.parse(JSON.stringify(updates.coordinates)) : undefined,
          });
          
          // Update local state
          set((state) => {
            if (!state.profile) return { profile: null, isLoading: false };
            return {
              profile: {
                ...state.profile,
                savedLocations: (state.profile.savedLocations || []).map((location) =>
                  location.id === locationId ? {
                    id: updatedLocation.id,
                    name: updatedLocation.name,
                    address: updatedLocation.address,
                    type: updatedLocation.type as "home" | "work" | "favorite" | "other",
                    isPrimary: updatedLocation.is_primary || false,
                    coordinates: updatedLocation.coordinates as { latitude: number; longitude: number } | undefined,
                  } : location
                )
              },
              isLoading: false
            };
          });
          console.log('✅ Saved location updated successfully');
        } catch (error) {
          console.error('Error updating saved location:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      removeSavedLocation: async (locationId) => {
        const { profile } = get();
        if (!profile) {
          throw new Error('No user profile found. Please load user profile first.');
        }

        try {
          set({ isLoading: true });
          await deleteSavedLocation(profile.id, locationId);
          
          // Update local state
          set((state) => {
            if (!state.profile) return { profile: null, isLoading: false };
            return {
              profile: {
                ...state.profile,
                savedLocations: (state.profile.savedLocations || []).filter((location) => location.id !== locationId)
              },
              isLoading: false
            };
          });
          console.log('✅ Saved location removed successfully');
        } catch (error) {
          console.error('Error removing saved location:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      setPrimaryLocation: async (locationId) => {
        const { profile } = get();
        if (!profile) {
          throw new Error('No user profile found. Please load user profile first.');
        }

        try {
          set({ isLoading: true });
          const updatedLocation = await setPrimaryLocation(profile.id, locationId);
          
          // Update local state
          set((state) => {
            if (!state.profile) return { profile: null, isLoading: false };
            return {
              profile: {
                ...state.profile,
                savedLocations: (state.profile.savedLocations || []).map((location) => ({
                  ...location,
                  isPrimary: location.id === locationId
                }))
              },
              isLoading: false
            };
          });
          console.log('✅ Primary location set successfully');
        } catch (error) {
          console.error('Error setting primary location:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      loadSavedLocations: async () => {
        const { profile } = get();
        if (!profile) {
          throw new Error('No user profile found. Please load user profile first.');
        }

        try {
          set({ isLoading: true });
          const locations = await getSavedLocations(profile.id);
          
          // Update local state
          set((state) => {
            if (!state.profile) return { profile: null, isLoading: false };
            return {
              profile: {
                ...state.profile,
                savedLocations: locations.map(location => ({
                  id: location.id,
                  name: location.name,
                  address: location.address,
                  type: location.type as "home" | "work" | "favorite" | "other",
                  isPrimary: location.is_primary || false,
                  coordinates: location.coordinates as { latitude: number; longitude: number } | undefined,
                }))
              },
              isLoading: false
            };
          });
          console.log('✅ Saved locations loaded successfully');
        } catch (error) {
          console.error('Error loading saved locations:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
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
      
      reset: () => set({ profile: null, isOnboarded: false }),
      
      clearPersistedState: async () => {
        await AsyncStorage.removeItem('user-storage');
        set({ profile: null, isOnboarded: false });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Handle migration from older versions
        if (version === 0) {
          // If migrating from version 0, reset to initial state
          return {
            profile: null,
            isOnboarded: false,
          };
        }
        return persistedState;
      },
    }
  )
);