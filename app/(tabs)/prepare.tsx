import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useTasksStore } from '@/store/tasks-store';
import { useUserStore } from '@/store/user-store';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import TaskCard from '@/components/TaskCard';
import ChecklistCard from '@/components/ChecklistCard';
import ProgressBar from '@/components/ProgressBar';
import CategoryFilter from '@/components/CategoryFilter';
import IconWrapper from '@/components/IconWrapper';
import { Plus } from 'lucide-react-native';

export default function PrepareScreen() {
  const router = useRouter();
  const { tasks, loadTasks, getTaskProgress } = useTasksStore();
  const { profile, loadCustomChecklists } = useUserStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCustomChecklists, setShowCustomChecklists] = useState(false);
  
  useEffect(() => {
    loadTasks();
    loadCustomChecklists(); // Ensure custom checklists are loaded
  }, []);

  // Refresh custom checklists when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('📋 [PrepareScreen] Screen focused, refreshing custom checklists...');
      loadCustomChecklists();
    }, [loadCustomChecklists])
  );
  
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
  
  // Enhanced debugging for custom checklists on prepare screen
  useEffect(() => {
    console.log('📋 [PrepareScreen] Custom Checklists Debug:');
    console.log('   Profile exists:', !!profile);
    console.log('   Custom checklists count:', customChecklists.length);
    console.log('   Raw custom checklists:', customChecklists.map(cl => ({
      id: cl.id,
      title: cl.title,
      category: cl.category,
      points: cl.points,
      isCompleted: cl.isCompleted,
      itemsCount: cl.items?.length || 0,
      items: cl.items?.map(item => ({
        text: item.text,
        isCompleted: item.isCompleted
      })) || []
    })));
    console.log('   Show custom checklists:', showCustomChecklists);
    console.log('   Selected category:', selectedCategory);
    console.log('   Filtered checklists count:', filteredChecklists.length);
  }, [profile, customChecklists, showCustomChecklists, selectedCategory, filteredChecklists]);
  
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
    <>
      <Stack.Screen 
        options={{
          title: "Prepare",
          headerRight: () => (
            <TouchableOpacity onPress={handleAddChecklist}>
              <Plus size={spacings.sectionSpacing} color={colors.text} style={{ marginRight: spacings.lg }} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={[]}>
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
          <ProgressBar progress={taskProgress.percentage} height={spacings.xs} />
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressContainer: {
    backgroundColor: colors.card,
    padding: spacings.screenPadding,
    paddingTop: spacings.xl,
    marginBottom: spacings.xs,
  },
  categorySection: {
    marginBottom: spacings.xs,
  },
  progressTitle: {
    fontSize: spacings.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacings.xs,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacings.xs,
  },
  progressText: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
  },
  progressPercentage: {
    fontSize: spacings.fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  listContent: {
    padding: spacings.screenPadding,
    paddingTop: spacings.xs,
  },
});