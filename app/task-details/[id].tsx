import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useTasksStore } from '@/store/tasks-store';
import { useUserStore } from '@/store/user-store';
import { PrepTask, CustomChecklist } from '@/types';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
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
  const { tasks, toggleTaskCompletion } = useTasksStore();
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
    
    toggleTaskCompletion(task.id);
    
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
      case 'supplies': return colors.danger;
      case 'planning': return colors.primary;
      case 'skills': return colors.success;
      case 'home': return colors.warning;
      case 'personal': return colors.secondary;
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
            <View style={{ flexDirection: 'row', gap: spacings.lg }}>
              {isCustomChecklist && (
                <TouchableOpacity onPress={handleEdit}>
                  <IconWrapper icon={Edit} size={spacings.sectionSpacing} color={colors.text} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleShare}>
                <IconWrapper icon={Share2} size={spacings.sectionSpacing} color={colors.text} />
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
                <View style={styles.pointsContainer}>
                  <IconWrapper icon={Award} size={16} color={colors.secondary} />
                  <Text style={styles.pointsText}>{checklist.points || 0} points</Text>
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
                  <IconWrapper icon={Circle} size={spacings.xl} color={colors.primary} /> : 
                  <IconWrapper icon={CheckCircle} size={spacings.xl} color={colors.textInverse} />
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
                textStyle={{ color: colors.danger }}
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
    backgroundColor: colors.card,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: spacings.xxxxl * 6,
    width: '100%',
  },
  image: {
    flex: 1,
    backgroundColor: colors.backgroundTertiary,
  },
  content: {
    padding: spacings.screenPadding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacings.lg,
  },
  categoryBadge: {
    backgroundColor: colors.primaryBadge,
    paddingHorizontal: spacings.md,
    paddingVertical: spacings.xs + 2,
    borderRadius: spacings.lg,
  },
  categoryText: {
    color: colors.primary,
    fontSize: spacings.fontSize.sm,
    fontWeight: '500',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    color: colors.secondary,
    fontSize: spacings.fontSize.md,
    fontWeight: '600',
    marginLeft: spacings.xs,
  },
  description: {
    fontSize: spacings.fontSize.md,
    color: colors.textSecondary,
    lineHeight: spacings.sectionSpacing,
    marginBottom: spacings.sectionSpacing,
  },
  stepsContainer: {
    marginBottom: spacings.sectionSpacing,
  },
  stepsTitle: {
    fontSize: spacings.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacings.lg,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: spacings.md,
  },
  stepNumber: {
    width: spacings.sectionSpacing,
    height: spacings.sectionSpacing,
    borderRadius: spacings.md,
    backgroundColor: colors.primary,
    color: colors.textInverse,
    textAlign: 'center',
    lineHeight: spacings.sectionSpacing,
    fontSize: spacings.fontSize.sm,
    fontWeight: '600',
    marginRight: spacings.md,
  },
  stepText: {
    flex: 1,
    fontSize: spacings.fontSize.md,
    color: colors.textSecondary,
    lineHeight: spacings.sectionSpacing,
  },
  disasterTypesContainer: {
    marginBottom: 24,
  },
  disasterTypesTitle: {
    fontSize: spacings.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacings.md,
  },
  disasterTypesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacings.xs,
  },
  disasterTypeBadge: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacings.md,
    paddingVertical: spacings.xs + 2,
    borderRadius: spacings.lg,
    marginRight: spacings.xs,
    marginBottom: spacings.xs,
  },
  disasterTypeText: {
    color: colors.textSecondary,
    fontSize: spacings.fontSize.sm,
  },
  actionButton: {
    marginTop: spacings.xs,
  },
  checklistItem: {
    paddingVertical: spacings.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSecondary,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checklistItemText: {
    fontSize: spacings.fontSize.md,
    color: colors.text,
    marginLeft: spacings.md,
    flex: 1,
  },
  completedItemText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  progressSection: {
    marginBottom: spacings.sectionSpacing,
  },
  progressBar: {
    height: spacings.xs,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: spacings.xs,
    marginBottom: spacings.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: spacings.xs,
  },
  deleteButton: {
    marginTop: spacings.xs,
    padding: spacings.md,
    borderRadius: spacings.borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.danger,
    alignItems: 'center',
  },
});