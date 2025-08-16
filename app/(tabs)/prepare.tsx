import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTasksStore } from '@/store/tasks-store';
import { useUserStore } from '@/store/user-store';
import { colors } from '@/constants/colors';
import TaskCard from '@/components/TaskCard';
import ChecklistCard from '@/components/ChecklistCard';
import ProgressBar from '@/components/ProgressBar';
import CategoryFilter from '@/components/CategoryFilter';
import IconWrapper from '@/components/IconWrapper';
import { Plus } from 'lucide-react-native';

export default function PrepareScreen() {
  const router = useRouter();
  const { tasks, fetchTasks, getTaskProgress } = useTasksStore();
  const { profile } = useUserStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCustomChecklists, setShowCustomChecklists] = useState(false);
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  const taskProgress = getTaskProgress();
  
  const taskCategories = [
    { id: 'supplies', name: 'Supplies' },
    { id: 'planning', name: 'Planning' },
    { id: 'skills', name: 'Skills' },
    { id: 'home', name: 'Home' },
    { id: 'personal', name: 'Personal' },
  ];
  
  const customChecklists = profile?.customChecklists || [];
  
  const filteredTasks = selectedCategory
    ? tasks.filter(task => task.category === selectedCategory)
    : tasks;
    
  const filteredChecklists = selectedCategory
    ? customChecklists.filter(checklist => checklist.category === selectedCategory)
    : customChecklists;
  
  const handleTaskPress = (taskId: string) => {
    router.push(`/task-details/${taskId}`);
  };
  
  const handleChecklistPress = (checklistId: string) => {
    router.push(`/task-details/${checklistId}`);
  };
  
  const handleEditChecklist = (checklistId: string) => {
    router.push({ pathname: '/modal', params: { checklistId } });
  };
  
  const handleAddChecklist = () => {
    router.push('/modal');
  };
  
  // Combine and sort items by priority (completed items last)
  const combinedItems = [
    ...filteredTasks.map(task => ({ type: 'task' as const, data: task, isCompleted: task.isCompleted })),
    ...filteredChecklists.map(checklist => ({ type: 'checklist' as const, data: checklist, isCompleted: checklist.isCompleted }))
  ].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) return 0;
    return a.isCompleted ? 1 : -1;
  });
  
  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Your Preparedness</Text>
          <View style={styles.progressDetails}>
            <Text style={styles.progressText}>
              {taskProgress.completed} of {taskProgress.total} tasks completed
            </Text>
            <Text style={styles.progressPercentage}>
              {Math.round(taskProgress.percentage)}%
            </Text>
          </View>
          <ProgressBar progress={taskProgress.percentage} height={8} />
        </View>
        
        <TouchableOpacity style={styles.addButton} onPress={handleAddChecklist}>
          <IconWrapper icon={Plus} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.categorySection}>
        <CategoryFilter
          categories={taskCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>
      
      <FlatList
        data={combinedItems}
        keyExtractor={(item, index) => `${item.type}-${item.data.id}-${index}`}
        renderItem={({ item }) => {
          if (item.type === 'task') {
            return (
              <TaskCard 
                task={item.data} 
                onPress={() => handleTaskPress(item.data.id)} 
              />
            );
          } else {
            return (
              <ChecklistCard
                checklist={item.data}
                onPress={() => handleChecklistPress(item.data.id)}
                onEdit={() => handleEditChecklist(item.data.id)}
              />
            );
          }
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingBottom: 8,
  },
  progressContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categorySection: {
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
});