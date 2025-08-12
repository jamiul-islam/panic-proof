import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTasksStore } from '@/store/tasks-store';
import { colors } from '@/constants/colors';
import TaskCard from '@/components/TaskCard';
import ProgressBar from '@/components/ProgressBar';
import CategoryFilter from '@/components/CategoryFilter';

export default function PrepareScreen() {
  const router = useRouter();
  const { tasks, fetchTasks, getTaskProgress } = useTasksStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  const taskProgress = getTaskProgress();
  
  const taskCategories = [
    { id: 'supplies', name: 'Supplies' },
    { id: 'planning', name: 'Planning' },
    { id: 'skills', name: 'Skills' },
    { id: 'home', name: 'Home' },
  ];
  
  const filteredTasks = selectedCategory
    ? tasks.filter(task => task.category === selectedCategory)
    : tasks;
  
  const handleTaskPress = (taskId: string) => {
    router.push(`/task-details/${taskId}`);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
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
      
      <CategoryFilter
        categories={taskCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard 
            task={item} 
            onPress={() => handleTaskPress(item.id)} 
          />
        )}
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
  progressContainer: {
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 20,
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