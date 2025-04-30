import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrepTask } from '@/types';
import { prepTasks as mockTasks } from '@/mocks/prep-tasks';
import { useUserStore } from './user-store';

interface TasksState {
  tasks: PrepTask[];
  fetchTasks: () => void;
  completeTask: (taskId: string) => void;
  uncompleteTask: (taskId: string) => void;
  getCompletedTasks: () => PrepTask[];
  getIncompleteTasks: () => PrepTask[];
  getTasksByCategory: (category: string) => PrepTask[];
  getTasksByDisasterType: (disasterType: string) => PrepTask[];
  getTaskProgress: () => { completed: number; total: number; percentage: number };
}

export const useTasksStore = create<TasksState>()((set, get) => ({
  tasks: [],
  
  fetchTasks: () => {
    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    const userProfile = useUserStore.getState().profile;
    
    if (userProfile) {
      const completedTaskIds = userProfile.completedTasks;
      const tasksWithCompletionStatus = mockTasks.map(task => ({
        ...task,
        isCompleted: completedTaskIds.includes(task.id)
      }));
      
      set({ tasks: tasksWithCompletionStatus });
    } else {
      set({ tasks: mockTasks });
    }
  },
  
  completeTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map(task => 
        task.id === taskId 
          ? { ...task, isCompleted: true } 
          : task
      )
    }));
    
    const task = get().tasks.find(t => t.id === taskId);
    if (task) {
      useUserStore.getState().completeTask(taskId, task.points);
    }
  },
  
  uncompleteTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map(task => 
        task.id === taskId 
          ? { ...task, isCompleted: false } 
          : task
      )
    }));
    
    const task = get().tasks.find(t => t.id === taskId);
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
    const completed = tasks.filter(task => task.isCompleted).length;
    const total = tasks.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return { completed, total, percentage };
  }
}));