import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useTasksStore } from '@/store/tasks-store';
import { useUserStore } from '@/store/user-store';
import { PrepTask, CustomChecklist } from '@/types';
import { colors } from '@/constants/colors';
import { 
  CheckCircle, 
  Circle, 
  Award, 
  Share2,
  Edit,
  Trash2,
  ArrowLeft
} from 'lucide-react-native';
import Button from '@/components/Button';
import IconWrapper from '@/components/IconWrapper';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { tasks, completeTask, uncompleteTask } = useTasksStore();
  const { profile, removeCustomChecklist, toggleChecklistItem } = useUserStore();
  const [task, setTask] = useState<PrepTask | null>(null);
  const [checklist, setChecklist] = useState<CustomChecklist | null>(null);
  const [isCustomChecklist, setIsCustomChecklist] = useState(false);
  
  useEffect(() => {
    if (id) {
      // First, try to find in tasks
      const foundTask = tasks.find(t => t.id === id);
      if (foundTask) {
        setTask(foundTask);
        setIsCustomChecklist(false);
        return;
      }
      
      // If not found in tasks, try to find in custom checklists
      const foundChecklist = profile?.customChecklists?.find(c => c.id === id);
      if (foundChecklist) {
        setChecklist(foundChecklist);
        setIsCustomChecklist(true);
        return;
      }
    }
  }, [id, tasks, profile]);
  
  const handleToggleCompletion = () => {
    if (isCustomChecklist && checklist) {
      // For checklists, we don't have a direct toggle - navigate to edit or show items
      return;
    }
    
    if (!task) return;
    
    if (task.isCompleted) {
      uncompleteTask(task.id);
    } else {
      completeTask(task.id);
    }
    
    // Update local state
    setTask({
      ...task,
      isCompleted: !task.isCompleted
    });
  };
  
  const handleEdit = () => {
    if (isCustomChecklist && checklist) {
      router.push({ pathname: '/modal', params: { checklistId: checklist.id } });
    }
  };
  
  const handleDelete = () => {
    if (!isCustomChecklist || !checklist) return;
    
    Alert.alert(
      'Delete Checklist',
      'Are you sure you want to delete this checklist? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeCustomChecklist(checklist.id);
            Alert.alert('Success', 'Checklist deleted successfully!', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          },
        },
      ]
    );
  };
  
  const toggleChecklistItemHandler = (itemId: string) => {
    if (isCustomChecklist && checklist) {
      toggleChecklistItem(checklist.id, itemId);
      // Update local state
      const updatedItems = checklist.items.map(item =>
        item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
      );
      setChecklist({
        ...checklist,
        items: updatedItems,
        isCompleted: updatedItems.every(item => item.isCompleted)
      });
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'supplies': return '#EF4444';
      case 'planning': return '#3B82F6';
      case 'skills': return '#10B981';
      case 'home': return '#F59E0B';
      case 'personal': return '#8B5CF6';
      default: return colors.primary;
    }
  };
  
  const handleShare = () => {
    // In a real app, this would use the Share API
    const itemToShare = isCustomChecklist ? checklist : task;
    console.log('Sharing:', itemToShare?.title);
  };
  
  if (!task && !checklist) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading details...</Text>
      </View>
    );
  }
  
  const currentItem = isCustomChecklist ? checklist : task;
  const completedItems = isCustomChecklist && checklist ? checklist.items.filter(item => item.isCompleted).length : 0;
  const totalItems = isCustomChecklist && checklist ? checklist.items.length : 0;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: currentItem?.title || 'Details',
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {isCustomChecklist && (
                <TouchableOpacity onPress={handleEdit}>
                  <IconWrapper icon={Edit} size={24} color="#000" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleShare}>
                <IconWrapper icon={Share2} size={24} color="#000" />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image
              source={currentItem?.imageUrl || (isCustomChecklist ? 'https://images.unsplash.com/photo-1494790108755-2616c9de1f96?w=400' : undefined)}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          </View>
          
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {currentItem?.category ? 
                    currentItem.category.charAt(0).toUpperCase() + currentItem.category.slice(1) : 
                    'Unknown'
                  }
                </Text>
              </View>
              
              {!isCustomChecklist && task && (
                <View style={styles.pointsContainer}>
                  <IconWrapper icon={Award} size={16} color={colors.secondary} />
                  <Text style={styles.pointsText}>{task.points} points</Text>
                </View>
              )}
              
              {isCustomChecklist && checklist && (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    {completedItems}/{totalItems} completed ({Math.round(progressPercentage)}%)
                  </Text>
                </View>
              )}
            </View>
            
            <Text style={styles.description}>{currentItem?.description}</Text>
            
            {/* For regular tasks - show steps */}
            {!isCustomChecklist && task?.steps && task.steps.length > 0 && (
              <View style={styles.stepsContainer}>
                <Text style={styles.stepsTitle}>Steps to Complete:</Text>
                
                {task.steps.map((step, index) => (
                  <View key={index} style={styles.stepItem}>
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}
            
            {/* For custom checklists - show items */}
            {isCustomChecklist && checklist && (
              <View style={styles.stepsContainer}>
                <Text style={styles.stepsTitle}>Checklist Items:</Text>
                
                {checklist.items.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.checklistItem}
                    onPress={() => toggleChecklistItemHandler(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.itemContent}>
                      {item.isCompleted ? (
                        <IconWrapper icon={CheckCircle} size={24} color={colors.success} />
                      ) : (
                        <IconWrapper icon={Circle} size={24} color={colors.text} />
                      )}
                      <Text 
                        style={[
                          styles.checklistItemText,
                          item.isCompleted && styles.completedItemText
                        ]}
                      >
                        {item.text}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {/* Progress bar for checklists */}
            {isCustomChecklist && checklist && (
              <View style={styles.progressSection}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${progressPercentage}%`,
                        backgroundColor: getCategoryColor(checklist.category)
                      }
                    ]} 
                  />
                </View>
              </View>
            )}
            
            {/* Disaster types for regular tasks */}
            {!isCustomChecklist && task && (
              <View style={styles.disasterTypesContainer}>
                <Text style={styles.disasterTypesTitle}>Relevant for:</Text>
                <View style={styles.disasterTypesList}>
                  {task.disasterTypes.map((type, index) => (
                    <View key={index} style={styles.disasterTypeBadge}>
                      <Text style={styles.disasterTypeText}>
                        {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {/* Action buttons */}
            {!isCustomChecklist && task ? (
              <Button
                title={task.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                onPress={handleToggleCompletion}
                variant={task.isCompleted ? "outline" : "primary"}
                icon={task.isCompleted ? 
                  <IconWrapper icon={Circle} size={20} color={colors.primary} /> : 
                  <IconWrapper icon={CheckCircle} size={20} color="#fff" />
                }
                iconPosition="left"
                style={styles.actionButton}
              />
            ) : isCustomChecklist && checklist && (
              <Button
                title="Delete Checklist"
                onPress={handleDelete}
                variant="outline"
                style={styles.deleteButton}
                textStyle={{ color: '#EF4444' }}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 240,
    width: '100%',
  },
  image: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 24,
  },
  stepsContainer: {
    marginBottom: 24,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  disasterTypesContainer: {
    marginBottom: 24,
  },
  disasterTypesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  disasterTypesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  disasterTypeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  disasterTypeText: {
    color: '#4B5563',
    fontSize: 14,
  },
  actionButton: {
    marginTop: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    color: '#6B7280',
    fontSize: 14,
  },
  checklistItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checklistItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  completedItemText: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  progressSection: {
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  deleteButton: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
});