import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { PrepTask } from '@/types';
import { useTasksStore } from '@/store/tasks-store';
import { CheckCircle, Circle, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import IconWrapper from '@/components/IconWrapper';

interface TaskCardProps {
  task: PrepTask;
  onPress?: () => void;
}

export default function TaskCard({ task, onPress }: TaskCardProps) {
  const { completeTask, uncompleteTask } = useTasksStore();
  
  const toggleCompletion = () => {
    if (task.isCompleted) {
      uncompleteTask(task.id);
    } else {
      completeTask(task.id);
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
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
          <Text style={styles.title} numberOfLines={1}>{task.title}</Text>
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              toggleCompletion();
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {task.isCompleted ? (
              <IconWrapper icon={CheckCircle} size={24} color={colors.success} />
            ) : (
              <IconWrapper icon={Circle} size={24} color={colors.text} />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsText}>{task.points} points</Text>
          </View>
          <IconWrapper icon={ChevronRight} size={16} color={colors.text} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  imageContainer: {
    height: 140,
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
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsContainer: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
});