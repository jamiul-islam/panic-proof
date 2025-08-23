import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { PrepTask } from '@/types';
import { useTasksStore } from '@/store/tasks-store';
import { CheckCircle, Circle, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import IconWrapper from '@/components/IconWrapper';

interface TaskCardProps {
  task: PrepTask;
  onPress?: () => void;
}

export default function TaskCard({ task, onPress }: TaskCardProps) {
  const { toggleTaskCompletion } = useTasksStore();
  
  const handleToggleCompletion = () => {
    toggleTaskCompletion(task.id);
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
              handleToggleCompletion();
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
    backgroundColor: colors.card,
    borderRadius: spacings.borderRadius.md,
    marginBottom: spacings.lg,
    overflow: 'hidden',
    ...spacings.lightShadow,
  },
  imageContainer: {
    height: 140,
    width: '100%',
  },
  image: {
    flex: 1,
    backgroundColor: colors.border,
  },
  content: {
    padding: spacings.cardPadding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacings.sm,
  },
  title: {
    fontSize: spacings.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: spacings.sm,
  },
  description: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacings.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsContainer: {
    backgroundColor: colors.primaryBadge,
    paddingHorizontal: spacings.sm + 2,
    paddingVertical: spacings.xs,
    borderRadius: spacings.borderRadius.md,
  },
  pointsText: {
    fontSize: spacings.fontSize.xs,
    color: colors.primary,
    fontWeight: '500',
  },
});