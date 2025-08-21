import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrepTask } from '@/types';
import { prepTasks as mockTasks } from '@/mocks/prep-tasks';
import { useUserStore } from './user-store';

interface TasksState {
  tasks: PrepTask[];
  completedTaskIds: string[];
  fetchTasks: () => void;
  completeTask: (taskId: string) => void;
  uncompleteTask: (taskId: string) => void;
  getCompletedTasks: () => PrepTask[];
  getIncompleteTasks: () => PrepTask[];
  getTasksByCategory: (category: string) => PrepTask[];
  getTasksByDisasterType: (disasterType: string) => PrepTask[];
  getTaskProgress: () => { completed: number; total: number; percentage: number };
  clearPersistedState: () => Promise<void>;
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      completedTaskIds: [],
      
      fetchTasks: () => {
        // In a real app, this would fetch from an API
        // For now, we'll use mock data with completion status from internal state
        const { completedTaskIds } = get();
        const tasksWithCompletionStatus = mockTasks.map(task => ({
          ...task,
          isCompleted: completedTaskIds.includes(task.id)
        }));
        
        set({ tasks: tasksWithCompletionStatus });
      },
      
      completeTask: (taskId) => {
        const currentState = get();
        
        // Don't add if already completed
        if (currentState.completedTaskIds.includes(taskId)) {
          return;
        }
        
        set((state) => ({
          tasks: state.tasks.map(task => 
            task.id === taskId 
              ? { ...task, isCompleted: true } 
              : task
          ),
          completedTaskIds: [...state.completedTaskIds, taskId]
        }));
        
        // Notify user store to update points
        const task = currentState.tasks.find(t => t.id === taskId);
        if (task) {
          useUserStore.getState().completeTask(taskId, task.points);
        }
      },
      
      uncompleteTask: (taskId) => {
        const currentState = get();
        
        // Only uncomplete if currently completed
        if (!currentState.completedTaskIds.includes(taskId)) {
          return;
        }
        
        set((state) => ({
          tasks: state.tasks.map(task => 
            task.id === taskId 
              ? { ...task, isCompleted: false } 
              : task
          ),
          completedTaskIds: state.completedTaskIds.filter(id => id !== taskId)
        }));
        
        // Notify user store to update points
        const task = currentState.tasks.find(t => t.id === taskId);
        if (task) {
          useUserStore.getState().uncompleteTask(taskId, task.points);
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
        
        return { completed, total, percentage };
      },
      
      clearPersistedState: async () => {
        await AsyncStorage.removeItem('tasks-storage');
        set({ tasks: [], completedTaskIds: [] });
      }
    }),
    {
      name: 'tasks-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Handle migration from older versions
        if (version === 0) {
          // If migrating from version 0, reset to initial state
          return {
            tasks: [],
            completedTaskIds: [],
          };
        }
        return persistedState;
      },
      partialize: (state) => ({ 
        completedTaskIds: state.completedTaskIds 
      }),
    }
  )
);