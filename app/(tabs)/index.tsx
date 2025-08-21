import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useUserStore } from '@/store/user-store';
import { useAlertsStore } from '@/store/alerts-store';
import { useTasksStore } from '@/store/tasks-store';
import { useDisastersStore } from '@/store/disasters-store';
import { AlertTriangle, MapPin, Bell, Shield, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import AlertCard from '@/components/AlertCard';
import TaskCard from '@/components/TaskCard';
import DisasterCard from '@/components/DisasterCard';
import ProgressBar from '@/components/ProgressBar';
import Button from '@/components/Button';
import IconWrapper from '@/components/IconWrapper';

export default function HomeScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const { profile, loadUserProfile } = useUserStore((state) => state);
  const { alerts, fetchAlerts, getActiveAlerts, getUnviewedAlerts } = useAlertsStore();
  const { tasks, fetchTasks, getTaskProgress, getIncompleteTasks } = useTasksStore();
  const { disasters, fetchDisasters } = useDisastersStore();
  const [unviewedAlertsCount, setUnviewedAlertsCount] = React.useState(0);
  
  useEffect(() => {
    // Fetch data when component mounts
    fetchAlerts();
    fetchTasks();
    fetchDisasters();
  }, []);

  // Load user profile if not already loaded
  useEffect(() => {
    if (!profile && userId) {
      loadUserProfile(userId);
    }
  }, [profile, userId, loadUserProfile]);
  
  useEffect(() => {
    const unviewedAlerts = getUnviewedAlerts();
    setUnviewedAlertsCount(unviewedAlerts.length);
  }, [alerts]);
  
  const activeAlerts = getActiveAlerts();
  const taskProgress = getTaskProgress();
  const incompleteTasks = getIncompleteTasks().slice(0, 3);
  
  const handleAlertPress = (alertId: string) => {
    router.push(`/alert-details/${alertId}`);
  };
  
  const handleTaskPress = (taskId: string) => {
    router.push(`/task-details/${taskId}`);
  };
  
  const handleDisasterPress = (disasterType: string) => {
    router.push(`/disaster-details/${disasterType}`);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {profile?.name || 'there'}!</Text>
            <View style={styles.locationContainer}>
              <IconWrapper icon={MapPin} size={spacings.fontSize.sm} color={colors.textSecondary} />
              <Text style={styles.location}>{profile?.location || 'Set your location'}</Text>
            </View>
          </View>
          
          {unviewedAlertsCount > 0 && (
            <TouchableOpacity 
              style={styles.alertBadge}
              onPress={() => router.push('/alerts')}
            >
              <IconWrapper icon={Bell} size={spacings.lg} color={colors.textInverse} />
              <Text style={styles.alertBadgeText}>{unviewedAlertsCount}</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <IconWrapper icon={Shield} size={spacings.xl} color={colors.primary} />
              <Text style={styles.sectionTitle}>Your Preparedness</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              {taskProgress.completed} of {taskProgress.total} tasks completed
            </Text>
          </View>
          
          <View style={styles.prepCard}>
            <ProgressBar 
              progress={taskProgress.percentage} 
              height={spacings.xs} 
              showPercentage 
              label="Overall Preparedness" 
            />
            
            <Button 
              title="Continue Preparing" 
              onPress={() => router.push('/prepare')} 
              variant="primary" 
              size="small" 
              style={styles.prepButton}
              icon={<IconWrapper icon={ArrowRight} size={spacings.lg} color={colors.textInverse} />}
              iconPosition="right"
            />
          </View>
        </View>
        
        {activeAlerts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <IconWrapper icon={AlertTriangle} size={spacings.xl} color={colors.danger} />
                <Text style={styles.sectionTitle}>Active Alerts</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/alerts')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            
            {activeAlerts.slice(0, 2).map((alert) => (
              <AlertCard 
                key={alert.id} 
                alert={alert} 
                onPress={() => handleAlertPress(alert.id)} 
              />
            ))}
          </View>
        )}
        
        {incompleteTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended Tasks</Text>
              <TouchableOpacity onPress={() => router.push('/prepare')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            
            {incompleteTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onPress={() => handleTaskPress(task.id)} 
              />
            ))}
          </View>
        )}
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Learn About Disasters</Text>
            <TouchableOpacity onPress={() => router.push('/disasters')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.disastersContainer}
          >
            {disasters.slice(0, 5).map((disaster) => (
              <DisasterCard 
                key={disaster.type} 
                disaster={disaster} 
                onPress={() => handleDisasterPress(disaster.type)} 
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacings.screenPadding,
    paddingTop: spacings.xl,
    paddingBottom: spacings.lg,
  },
  greeting: {
    fontSize: spacings.fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacings.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacings.xs,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: spacings.xl,
    paddingHorizontal: spacings.md,
    paddingVertical: spacings.xs + 2,
  },
  alertBadgeText: {
    color: colors.textInverse,
    fontSize: spacings.fontSize.sm,
    fontWeight: '600',
    marginLeft: spacings.xs,
  },
  section: {
    marginBottom: spacings.sectionSpacing,
    paddingHorizontal: spacings.screenPadding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacings.md,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: spacings.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacings.xs,
  },
  sectionSubtitle: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
  },
  seeAll: {
    fontSize: spacings.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  prepCard: {
    backgroundColor: colors.card,
    borderRadius: spacings.borderRadius.md,
    padding: spacings.cardPadding,
  },
  prepButton: {
    marginTop: spacings.lg,
  },
  disastersContainer: {
    paddingVertical: spacings.xs,
    paddingRight: spacings.lg,
  },
});