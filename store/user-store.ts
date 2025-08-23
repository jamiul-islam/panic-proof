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
import { useAuthStore } from './auth-store';

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
  // Custom Checklists - now integrated with Supabase
  loadCustomChecklists: () => Promise<void>;
  addCustomChecklist: (checklist: Omit<CustomChecklist, 'id'>) => Promise<void>;
  updateCustomChecklist: (checklistId: string, updates: Partial<CustomChecklist>) => Promise<void>;
  removeCustomChecklist: (checklistId: string) => Promise<void>;
  toggleChecklistItem: (checklistId: string, itemId: string) => Promise<void>;
  // Other methods remain the same
  completeTask: (taskId: string, points: number) => void;
  uncompleteTask: (taskId: string, points: number) => void;
  addBadge: (badge: Badge) => void;
  addKitItem: (item: KitItem) => void;
  updateKitItem: (itemId: string, updates: Partial<KitItem>) => void;
  removeKitItem: (itemId: string) => void;
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
              customChecklists: [], // Will be loaded from Supabase separately
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
            
            // Load custom checklists from Supabase
            console.log('🔄 [UserStore] About to call loadCustomChecklists...');
            try {
              await get().loadCustomChecklists();
              console.log('✅ [UserStore] loadCustomChecklists completed');
            } catch (error) {
              console.error('❌ [UserStore] loadCustomChecklists failed:', error);
            }
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
        
        const oldPoints = state.profile.points;
        const newPoints = oldPoints + points;
        const newLevel = Math.floor(newPoints / 100) + 1;
        
        console.log(`🎯 [UserStore] Task completed - ID: ${taskId}, Points: ${points}`);
        console.log(`📊 [UserStore] Points: ${oldPoints} + ${points} = ${newPoints} (Level: ${newLevel})`);
        
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
        
        const oldPoints = state.profile.points;
        const newPoints = Math.max(0, oldPoints - points);
        const newLevel = Math.floor(newPoints / 100) + 1;
        
        console.log(`❌ [UserStore] Task uncompleted - ID: ${taskId}, Points: ${points}`);
        console.log(`📊 [UserStore] Points: ${oldPoints} - ${points} = ${newPoints} (Level: ${newLevel})`);
        
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
      
      setOnboarded: (value) => set({ isOnboarded: value }),
      
      // Custom Checklists - Supabase integration
      loadCustomChecklists: async () => {
        console.log('📋 [UserStore] ========== LOADING CUSTOM CHECKLISTS ==========');
        
        try {
          // Get current user from auth store
          const authStore = useAuthStore.getState();
          const clerkUserId = authStore.userId;
          console.log('🔍 [UserStore] Auth debug:', { clerkUserId, isAuthenticated: authStore.isAuthenticated });
          
          if (!clerkUserId) {
            console.warn('⚠️ [UserStore] No user ID available, skipping custom checklist load');
            return;
          }
          
          // Get the user's UUID from their Clerk ID
          console.log('🔍 [UserStore] Looking up user UUID for Clerk ID:', clerkUserId);
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_user_id', clerkUserId)
            .single();
            
          if (userError || !userData) {
            console.error('❌ [UserStore] Error finding user for checklists:', userError);
            return;
          }
          
          const userUuid = userData.id;
          console.log('🆔 [UserStore] Found user UUID for checklists:', userUuid);
          
          // Load user's custom checklists
          console.log('🔍 [UserStore] Querying user_checklists table...');
          const { data: checklistsData, error: checklistsError } = await supabase
            .from('user_checklists')
            .select(`
              *,
              user_checklist_items (
                id,
                text,
                is_completed,
                item_order
              )
            `)
            .eq('user_id', userUuid)
            .order('created_at', { ascending: true });
            
          if (checklistsError) {
            console.error('❌ [UserStore] Error loading custom checklists:', checklistsError);
            return;
          }
          
          console.log('✅ [UserStore] Raw checklists data:', JSON.stringify(checklistsData, null, 2));
          
          // Transform Supabase data to CustomChecklist format
          const transformedChecklists = checklistsData.map(checklist => {
            console.log('🔄 [UserStore] Transforming checklist:', checklist.title, 'with', checklist.user_checklist_items?.length, 'items');
            return {
              id: checklist.id,
              title: checklist.title,
              description: checklist.description || '',
              category: checklist.category as "supplies" | "planning" | "skills" | "home",
              points: checklist.points || 0,
              isCompleted: checklist.is_completed,
              imageUrl: checklist.image_url || undefined,
              items: checklist.user_checklist_items
                .sort((a, b) => a.item_order - b.item_order)
                .map(item => {
                  console.log('   📝 [UserStore] Item:', item.text, 'completed:', item.is_completed);
                  return {
                    id: item.id,
                    text: item.text,
                    isCompleted: item.is_completed
                  };
                }),
              createdAt: checklist.created_at ? new Date(checklist.created_at).toISOString() : new Date().toISOString(),
              updatedAt: checklist.updated_at ? new Date(checklist.updated_at).toISOString() : new Date().toISOString()
            };
          });
          
          console.log('🔄 [UserStore] Transformed checklists:', JSON.stringify(transformedChecklists, null, 2));
          
          // Update the profile with the loaded checklists
          set((state) => {
            if (!state.profile) {
              console.warn('⚠️ [UserStore] No profile found to update with checklists');
              return { profile: null };
            }
            console.log('🔄 [UserStore] Updating profile with checklists...');
            return {
              profile: {
                ...state.profile,
                customChecklists: transformedChecklists
              }
            };
          });
          
          console.log('📊 [UserStore] ========== CUSTOM CHECKLISTS LOADED AND PROFILE UPDATED ==========');
          
        } catch (error) {
          console.error('💥 [UserStore] Unexpected error loading custom checklists:', error);
        }
      },
      
      addCustomChecklist: async (checklist) => {
        console.log('➕ [UserStore] Adding custom checklist to Supabase:', checklist.title);
        
        try {
          // Get current user from auth store  
          const authStore = useAuthStore.getState();
          const clerkUserId = authStore.userId;
          
          if (!clerkUserId) {
            console.warn('⚠️ [UserStore] No user ID available for checklist creation');
            return;
          }
          
          // Get the user's UUID from their Clerk ID
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_user_id', clerkUserId)
            .single();
            
          if (userError || !userData) {
            console.error('❌ [UserStore] Error finding user for checklist creation:', userError);
            return;
          }
          
          const userUuid = userData.id;
          console.log('🆔 [UserStore] Creating checklist for user UUID:', userUuid);
          
          // Insert the checklist
          const { data: checklistData, error: checklistError } = await supabase
            .from('user_checklists')
            .insert({
              user_id: userUuid,
              title: checklist.title,
              description: checklist.description,
              category: checklist.category,
              points: checklist.points,
              is_completed: checklist.isCompleted,
              image_url: checklist.imageUrl
            })
            .select()
            .single();
            
          if (checklistError || !checklistData) {
            console.error('❌ [UserStore] Error creating custom checklist:', checklistError);
            return;
          }
          
          console.log('✅ [UserStore] Custom checklist created with ID:', checklistData.id);
          
          // Insert the checklist items
          if (checklist.items && checklist.items.length > 0) {
            const itemsToInsert = checklist.items.map((item, index) => ({
              checklist_id: checklistData.id,
              text: item.text,
              is_completed: item.isCompleted,
              item_order: index
            }));
            
            const { error: itemsError } = await supabase
              .from('user_checklist_items')
              .insert(itemsToInsert);
              
            if (itemsError) {
              console.error('❌ [UserStore] Error creating checklist items:', itemsError);
              return;
            }
            
            console.log('✅ [UserStore] Created', checklist.items.length, 'checklist items');
          }
          
          // Reload checklists to update the UI
          await get().loadCustomChecklists();
          
        } catch (error) {
          console.error('💥 [UserStore] Unexpected error adding custom checklist:', error);
        }
      },
      
      updateCustomChecklist: async (checklistId, updates) => {
        console.log('🔄 [UserStore] Updating custom checklist:', checklistId);
        
        try {
          // Update the checklist in Supabase
          const supabaseUpdates: any = {};
          if (updates.title !== undefined) supabaseUpdates.title = updates.title;
          if (updates.description !== undefined) supabaseUpdates.description = updates.description;
          if (updates.category !== undefined) supabaseUpdates.category = updates.category;
          if (updates.points !== undefined) supabaseUpdates.points = updates.points;
          if (updates.isCompleted !== undefined) supabaseUpdates.is_completed = updates.isCompleted;
          if (updates.imageUrl !== undefined) supabaseUpdates.image_url = updates.imageUrl;
          supabaseUpdates.updated_at = new Date().toISOString();
          
          const { error: updateError } = await supabase
            .from('user_checklists')
            .update(supabaseUpdates)
            .eq('id', checklistId);
            
          if (updateError) {
            console.error('❌ [UserStore] Error updating custom checklist:', updateError);
            return;
          }
          
          console.log('✅ [UserStore] Custom checklist updated successfully');
          
          // Reload checklists to update the UI
          await get().loadCustomChecklists();
          
        } catch (error) {
          console.error('💥 [UserStore] Unexpected error updating custom checklist:', error);
        }
      },
      
      removeCustomChecklist: async (checklistId) => {
        console.log('🗑️ [UserStore] Removing custom checklist:', checklistId);
        
        try {
          // Delete checklist items first (due to foreign key constraint)
          const { error: itemsError } = await supabase
            .from('user_checklist_items')
            .delete()
            .eq('checklist_id', checklistId);
            
          if (itemsError) {
            console.error('❌ [UserStore] Error deleting checklist items:', itemsError);
            return;
          }
          
          // Delete the checklist
          const { error: checklistError } = await supabase
            .from('user_checklists')
            .delete()
            .eq('id', checklistId);
            
          if (checklistError) {
            console.error('❌ [UserStore] Error deleting custom checklist:', checklistError);
            return;
          }
          
          console.log('✅ [UserStore] Custom checklist and items deleted successfully');
          
          // Reload checklists to update the UI
          await get().loadCustomChecklists();
          
        } catch (error) {
          console.error('💥 [UserStore] Unexpected error removing custom checklist:', error);
        }
      },
      
      toggleChecklistItem: async (checklistId, itemId) => {
        console.log('🔄 [UserStore] Toggling checklist item:', { checklistId, itemId });
        
        try {
          // Get current item state
          const { data: itemData, error: itemError } = await supabase
            .from('user_checklist_items')
            .select('is_completed')
            .eq('id', itemId)
            .single();
            
          if (itemError || !itemData) {
            console.error('❌ [UserStore] Error fetching checklist item:', itemError);
            return;
          }
          
          const newCompletedState = !itemData.is_completed;
          console.log('🔄 [UserStore] Toggling item from', itemData.is_completed, 'to', newCompletedState);
          
          // Update the item
          const { error: updateError } = await supabase
            .from('user_checklist_items')
            .update({ is_completed: newCompletedState })
            .eq('id', itemId);
            
          if (updateError) {
            console.error('❌ [UserStore] Error updating checklist item:', updateError);
            return;
          }
          
          // Check if all items are completed and update checklist completion status
          const { data: allItemsData, error: allItemsError } = await supabase
            .from('user_checklist_items')
            .select('is_completed')
            .eq('checklist_id', checklistId);
            
          if (allItemsError) {
            console.error('❌ [UserStore] Error fetching all checklist items:', allItemsError);
            return;
          }
          
          const allItemsCompleted = allItemsData.length > 0 && allItemsData.every(item => item.is_completed);
          console.log('📊 [UserStore] All items completed:', allItemsCompleted);
          
          // Update checklist completion status
          const { error: checklistUpdateError } = await supabase
            .from('user_checklists')
            .update({ 
              is_completed: allItemsCompleted,
              updated_at: new Date().toISOString()
            })
            .eq('id', checklistId);
            
          if (checklistUpdateError) {
            console.error('❌ [UserStore] Error updating checklist completion:', checklistUpdateError);
            return;
          }
          
          // If checklist was just completed or uncompleted, update points
          const currentState = get();
          const currentChecklist = currentState.profile?.customChecklists?.find(c => c.id === checklistId);
          
          if (currentChecklist) {
            const checklistPoints = currentChecklist.points || 0;
            if (allItemsCompleted && !currentChecklist.isCompleted) {
              // Checklist completed - add points
              currentState.completeTask(checklistId, checklistPoints);
              console.log('✅ Checklist "' + currentChecklist.title + '" completed! Awarded ' + checklistPoints + ' points');
            } else if (!allItemsCompleted && currentChecklist.isCompleted) {
              // Checklist uncompleted - remove points
              currentState.uncompleteTask(checklistId, checklistPoints);
              console.log('❌ Checklist "' + currentChecklist.title + '" uncompleted! Removed ' + checklistPoints + ' points');
            }
          }
          
          console.log('✅ [UserStore] Checklist item toggled successfully');
          
          // Reload checklists to update the UI
          await get().loadCustomChecklists();
          
        } catch (error) {
          console.error('💥 [UserStore] Unexpected error toggling checklist item:', error);
        }
      },
      
      reset: () => set({ profile: null, isOnboarded: false }),
      
      clearPersistedState: async () => {
        await AsyncStorage.removeItem('user-storage');
        set({ profile: null, isOnboarded: false });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 3, // Increment version again to force cache clearing for updated data
      migrate: (persistedState: any, version: number) => {
        // Handle migration from older versions
        console.log('🔄 [UserStore] Migration triggered, version:', version);
        console.log('💥 [UserStore] Previous version:', version, 'Current version: 3');
        if (version < 3) {
          // Force clear cached data to reload checklists fresh from Supabase
          console.log('💥 [UserStore] Clearing cached profile to reload checklists');
          
          // Clear AsyncStorage manually to force fresh reload
          AsyncStorage.multiRemove([
            'user-storage',
            'profile-cache-key',
            'user-profile-key'
          ]).then(() => {
            console.log('🗑️ [UserStore] All user cache keys manually cleared');
          });
          
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