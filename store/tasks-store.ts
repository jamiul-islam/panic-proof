import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrepTask, DisasterType } from '@/types';
import { TaskRow, TaskCompletionRow } from '@/types/supabase';
import { supabase } from '@/lib/supabase';
import { useUserStore } from './user-store';
import { useAuthStore } from './auth-store';

interface TasksState {
  tasks: PrepTask[];
  completedTaskIds: Set<string>;
  loading: boolean;
  error: string | null;
  
  // Main actions
  loadTasks: () => Promise<void>;
  toggleTaskCompletion: (taskId: string) => Promise<void>;
  
  // Helper methods
  getCompletedTasks: () => PrepTask[];
  getIncompleteTasks: () => PrepTask[];
  getTasksByCategory: (category: string) => PrepTask[];
  getTasksByDisasterType: (disasterType: string) => PrepTask[];
  getTaskProgress: () => { completed: number; total: number; percentage: number };
  getTotalPointsFromTasks: () => number;
  isTaskCompleted: (taskId: string) => boolean;
  
  // Utils
  clearPersistedState: () => Promise<void>;
}

const transformTaskFromSupabase = (task: TaskRow): PrepTask => {
  // Transform disaster types with type checking
  let disasterTypes: DisasterType[] = [];
  if (Array.isArray(task.disaster_types)) {
    disasterTypes = task.disaster_types.filter((type): type is DisasterType => {
      const validTypes: DisasterType[] = [
        "flood", "earthquake", "wildfire", "hurricane", "tornado", 
        "tsunami", "winter_storm", "extreme_heat", "pandemic"
      ];
      return validTypes.includes(type as DisasterType);
    });
  }

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    points: task.points,
    isCompleted: false, // Will be set based on completion status
    category: task.category as "supplies" | "planning" | "skills" | "home",
    disasterTypes,
    steps: Array.isArray(task.steps) ? task.steps as string[] : undefined,
    imageUrl: task.image_url || undefined,
  };
};

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      completedTaskIds: new Set<string>(),
      loading: false,
      error: null,
      
      loadTasks: async () => {
        console.log('📋 [TasksStore] Loading tasks from Supabase...');
        set({ loading: true, error: null });
        
        try {
          // Get current user from auth store
          const authStore = useAuthStore.getState();
          const clerkUserId = authStore.userId;
          
          console.log('🔍 [TasksStore] Auth store debug:', {
            isAuthenticated: authStore.isAuthenticated,
            hasCompletedOnboarding: authStore.hasCompletedOnboarding,
            userId: clerkUserId,
            userEmail: authStore.userEmail,
            lastSignInTime: authStore.lastSignInTime
          });
          
          if (!clerkUserId) {
            console.warn('⚠️ [TasksStore] No user ID available, skipping task load');
            console.log('🔍 [TasksStore] Full auth state:', JSON.stringify(authStore, null, 2));
            set({ loading: false });
            return;
          }
          
          console.log('👤 [TasksStore] Loading tasks for Clerk user:', clerkUserId);
          
          // First, get the user's UUID from their Clerk ID
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_user_id', clerkUserId)
            .single();
            
          if (userError || !userData) {
            console.error('❌ [TasksStore] Error finding user:', userError);
            set({ error: `User not found: ${userError?.message || 'Unknown error'}`, loading: false });
            return;
          }
          
          const userUuid = userData.id;
          console.log('🆔 [TasksStore] Found user UUID:', userUuid);
          
          // Load tasks from Supabase
          const { data: tasksData, error: tasksError } = await supabase
            .from('tasks')
            .select('*')
            .order('category', { ascending: true });
            
          if (tasksError) {
            console.error('❌ [TasksStore] Error loading tasks:', tasksError);
            set({ error: `Failed to load tasks: ${tasksError.message}`, loading: false });
            return;
          }
          
          console.log('✅ [TasksStore] Loaded tasks:', tasksData.length);
          
          // Load user's task completions using UUID
          const { data: completionsData, error: completionsError } = await supabase
            .from('tasks_completions')
            .select('task_id')
            .eq('user_id', userUuid);
            
          if (completionsError) {
            console.error('❌ [TasksStore] Error loading completions:', completionsError);
            set({ error: `Failed to load completions: ${completionsError.message}`, loading: false });
            return;
          }
          
          console.log('✅ [TasksStore] Loaded completions:', completionsData.length);
          
          // Create completed tasks Set for fast lookups
          const completedTaskIds = new Set(completionsData.map(c => c.task_id));
          console.log('🎯 [TasksStore] Completed task IDs:', Array.from(completedTaskIds));
          
          // Transform tasks and set completion status
          const transformedTasks = tasksData.map(task => ({
            ...transformTaskFromSupabase(task),
            isCompleted: completedTaskIds.has(task.id)
          }));
          
          console.log('📊 [TasksStore] Tasks summary:', {
            total: transformedTasks.length,
            completed: transformedTasks.filter(t => t.isCompleted).length,
            categories: transformedTasks.reduce((acc, task) => {
              acc[task.category] = (acc[task.category] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          });
          
          set({
            tasks: transformedTasks,
            completedTaskIds,
            loading: false,
            error: null
          });
          
        } catch (error) {
          console.error('💥 [TasksStore] Unexpected error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
            loading: false 
          });
        }
      },
      
      toggleTaskCompletion: async (taskId: string) => {
        console.log('🔄 [TasksStore] Toggling task completion:', taskId);
        
        try {
          // Get current user from auth store
          const authStore = useAuthStore.getState();
          const clerkUserId = authStore.userId;
          
          if (!clerkUserId) {
            console.warn('⚠️ [TasksStore] No user ID available for task completion');
            return;
          }
          
          // Get the user's UUID from their Clerk ID
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_user_id', clerkUserId)
            .single();
            
          if (userError || !userData) {
            console.error('❌ [TasksStore] Error finding user for task completion:', userError);
            return;
          }
          
          const userUuid = userData.id;
          console.log('🆔 [TasksStore] Using user UUID for completion:', userUuid);
          
          const currentState = get();
          const task = currentState.tasks.find(t => t.id === taskId);
          
          if (!task) {
            console.error('❌ [TasksStore] Task not found:', taskId);
            return;
          }
          
          const isCurrentlyCompleted = currentState.completedTaskIds.has(taskId);
          console.log(`🎯 [TasksStore] Task "${task.title}" currently completed:`, isCurrentlyCompleted);
          
          if (isCurrentlyCompleted) {
            // Remove completion
            console.log('➖ [TasksStore] Removing task completion...');
            
            const { error } = await supabase
              .from('tasks_completions')
              .delete()
              .match({ user_id: userUuid, task_id: taskId });
              
            if (error) {
              console.error('❌ [TasksStore] Error removing completion:', error);
              return;
            }
            
            // Update local state
            const newCompletedTaskIds = new Set(currentState.completedTaskIds);
            newCompletedTaskIds.delete(taskId);
            
            set((state) => ({
              completedTaskIds: newCompletedTaskIds,
              tasks: state.tasks.map(t => 
                t.id === taskId ? { ...t, isCompleted: false } : t
              )
            }));
            
            // Update user points
            const userStore = useUserStore.getState();
            userStore.uncompleteTask(taskId, task.points);
            console.log('✅ [TasksStore] Task completion removed successfully');
            
          } else {
            // Add completion
            console.log('➕ [TasksStore] Adding task completion...');
            
            const { error } = await supabase
              .from('tasks_completions')
              .insert({
                user_id: userUuid,
                task_id: taskId,
                points_awarded: task.points
              });
              
            if (error) {
              console.error('❌ [TasksStore] Error adding completion:', error);
              return;
            }
            
            // Update local state
            const newCompletedTaskIds = new Set(currentState.completedTaskIds);
            newCompletedTaskIds.add(taskId);
            
            set((state) => ({
              completedTaskIds: newCompletedTaskIds,
              tasks: state.tasks.map(t => 
                t.id === taskId ? { ...t, isCompleted: true } : t
              )
            }));
            
            // Update user points
            const userStore = useUserStore.getState();
            userStore.completeTask(taskId, task.points);
            console.log('✅ [TasksStore] Task completion added successfully');
          }
          
          // Log updated totals
          const updatedState = get();
          const completedCount = updatedState.tasks.filter(t => t.isCompleted).length;
          console.log('📊 [TasksStore] Updated completion stats:', {
            completed: completedCount,
            total: updatedState.tasks.length,
            totalPoints: updatedState.getTotalPointsFromTasks()
          });
          
        } catch (error) {
          console.error('💥 [TasksStore] Unexpected error in toggleTaskCompletion:', error);
        }
      },
      
      getCompletedTasks: () => {
        return get().tasks.filter(task => task.isCompleted);
      },
      
      getIncompleteTasks: () => {
        return get().tasks.filter(task => !task.isCompleted);
      },
      
      getTasksByCategory: (category) => {
        return get().tasks.filter(task => task.category === category);
      },
      
      getTasksByDisasterType: (disasterType) => {
        return get().tasks.filter(task => 
          task.disasterTypes.includes(disasterType as any)
        );
      },
      
      isTaskCompleted: (taskId: string) => {
        return get().completedTaskIds.has(taskId);
      },
      
      getTotalPointsFromTasks: () => {
        const { tasks } = get();
        const completedTasks = tasks.filter(task => task.isCompleted);
        const totalPoints = completedTasks.reduce((total, task) => {
          console.log(`💰 [TasksStore] Adding task points: "${task.title}" = ${task.points}`);
          return total + task.points;
        }, 0);
        
        console.log('💎 [TasksStore] Total points from tasks:', totalPoints);
        console.log('🔍 [TasksStore] Completed tasks breakdown:', completedTasks.map(t => ({ title: t.title, points: t.points })));
        return totalPoints;
      },
      
      getTaskProgress: () => {
        const tasks = get().tasks;
        const userProfile = useUserStore.getState().profile;
        const customChecklists = userProfile?.customChecklists || [];
        
        // Count completed tasks
        const completedTasks = tasks.filter(task => task.isCompleted).length;
        const totalTasks = tasks.length;
        
        // Count completed custom checklists
        const completedChecklists = customChecklists.filter(checklist => checklist.isCompleted).length;
        const totalChecklists = customChecklists.length;
        
        // Combined totals
        const completed = completedTasks + completedChecklists;
        const total = totalTasks + totalChecklists;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        
        console.log('📈 [TasksStore] Progress calculation:', {
          tasks: { completed: completedTasks, total: totalTasks },
          checklists: { completed: completedChecklists, total: totalChecklists },
          overall: { completed, total, percentage: Math.round(percentage) }
        });
        
        return { completed, total, percentage };
      },
      
      clearPersistedState: async () => {
        console.log('🧹 [TasksStore] Clearing persisted state...');
        await AsyncStorage.removeItem('tasks-storage');
        set({ 
          tasks: [], 
          completedTaskIds: new Set<string>(),
          loading: false,
          error: null 
        });
      }
    }),
    {
      name: 'tasks-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persistedState: any, version: number) => {
        console.log('🔄 [TasksStore] Migrating from version:', version);
        
        if (version < 2) {
          // Convert old array to Set and add new fields
          const oldCompletedTaskIds = persistedState.completedTaskIds || [];
          return {
            tasks: [],
            completedTaskIds: new Set(oldCompletedTaskIds),
            loading: false,
            error: null
          };
        }
        return persistedState;
      },
      partialize: (state) => ({ 
        // Only persist completion IDs - tasks will be loaded from Supabase
        completedTaskIds: Array.from(state.completedTaskIds) // Convert Set to Array for storage
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert stored array back to Set
          state.completedTaskIds = new Set(state.completedTaskIds);
          console.log('💧 [TasksStore] Rehydrated completion IDs:', Array.from(state.completedTaskIds));
        }
      }
    }
  )
);