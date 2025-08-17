import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUserStore } from '@/store/user-store';
import { useTasksStore } from '@/store/tasks-store';
import { colors } from '@/constants/colors';
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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  levelLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.text,
  },
  progressValue: {
    fontSize: 14,
    color: '#6B7280',
  },
});