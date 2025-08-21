import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUserStore } from '@/store/user-store';
import { useTasksStore } from '@/store/tasks-store';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import ProgressBar from './ProgressBar';

export default function ProfileHeader() {
  const profile = useUserStore((state) => state.profile);
  const { getCompletedTasks, getTaskProgress } = useTasksStore();
  
  if (!profile) return null;
  
  // Get completed tasks count
  const completedTasks = getCompletedTasks();
  const completedTasksCount = completedTasks.length;
  
  // Get completed checklists count
  const completedChecklists = (profile.customChecklists || []).filter(checklist => checklist.isCompleted);
  const completedChecklistsCount = completedChecklists.length;
  
  // Calculate total completed items (tasks + checklists)
  const totalCompletedItems = completedTasksCount + completedChecklistsCount;
  
  // Debug logging for points and checklists
  React.useEffect(() => {
    console.log('🎯 ProfileHeader Debug:');
    console.log('   Points:', profile.points);
    console.log('   Level:', profile.level);
    console.log('   Completed tasks:', completedTasksCount);
    console.log('   Total checklists:', (profile.customChecklists || []).length);
    console.log('   Completed checklists:', completedChecklistsCount);
    console.log('   Checklist details:', (profile.customChecklists || []).map(c => ({
      title: c.title,
      points: c.points,
      isCompleted: c.isCompleted,
      completedItems: c.items.filter(item => item.isCompleted).length,
      totalItems: c.items.length
    })));
  }, [profile.points, profile.level, completedTasksCount, completedChecklistsCount, profile.customChecklists]);
  
  // Calculate XP progress to next level (every 100 points = 1 level)
  const currentLevelPoints = (profile.level - 1) * 100;
  const nextLevelPoints = profile.level * 100;
  const pointsInCurrentLevel = profile.points - currentLevelPoints;
  const progressToNextLevel = Math.min((pointsInCurrentLevel / 100) * 100, 100);
  
  return (
    <View style={styles.container}>
      <View style={styles.levelContainer}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{profile.level}</Text>
        </View>
        <Text style={styles.levelLabel}>Level {profile.level}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{profile.points}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{totalCompletedItems}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{profile.badges.length}</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressLabelContainer}>
          <Text style={styles.progressLabel}>Progress to Level {profile.level + 1}</Text>
          <Text style={styles.progressValue}>
            {pointsInCurrentLevel}/100 XP
          </Text>
        </View>
        <ProgressBar progress={progressToNextLevel} height={8} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: spacings.borderRadius.lg,
    padding: spacings.cardPadding,
    marginBottom: spacings.lg,
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: spacings.lg,
  },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacings.sm,
  },
  levelText: {
    color: colors.textInverse,
    fontSize: spacings.fontSize.lg,
    fontWeight: '700',
  },
  levelLabel: {
    fontSize: spacings.fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacings.lg,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: spacings.fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacings.xs / 2,
  },
  statLabel: {
    fontSize: spacings.fontSize.xs,
    color: colors.textSecondary,
  },
  progressContainer: {
    marginTop: spacings.sm,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacings.xs,
  },
  progressLabel: {
    fontSize: spacings.fontSize.sm,
    color: colors.text,
  },
  progressValue: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
  },
});