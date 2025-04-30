import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTasksStore } from '@/store/tasks-store';
import { PrepTask } from '@/types';
import { colors } from '@/constants/colors';
import { 
  CheckCircle, 
  Circle, 
  Award, 
  Share2 
} from 'lucide-react-native';
import Button from '@/components/Button';
import IconWrapper from '@/components/IconWrapper';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { tasks, completeTask, uncompleteTask } = useTasksStore();
  const [task, setTask] = useState<PrepTask | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundTask = tasks.find(t => t.id === id);
      if (foundTask) {
        setTask(foundTask);
      }
    }
  }, [id, tasks]);
  
  const handleToggleCompletion = () => {
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
  
  const handleShare = () => {
    // In a real app, this would use the Share API
    console.log('Sharing task:', task?.title);
  };
  
  if (!task) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading task details...</Text>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: task.title,
          headerRight: () => (
            <IconWrapper 
              icon={Share2} 
              size={24} 
              color="#000" 
              style={{ marginRight: 16 }}
              onPress={handleShare}
            />
          ),
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image
              source={task.imageUrl}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          </View>
          
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                </Text>
              </View>
              
              <View style={styles.pointsContainer}>
                <IconWrapper icon={Award} size={16} color={colors.secondary} />
                <Text style={styles.pointsText}>{task.points} points</Text>
              </View>
            </View>
            
            <Text style={styles.description}>{task.description}</Text>
            
            {task.steps && task.steps.length > 0 && (
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
});