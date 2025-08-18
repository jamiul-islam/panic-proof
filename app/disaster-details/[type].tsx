import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useDisastersStore } from '@/store/disasters-store';
import { useTasksStore } from '@/store/tasks-store';
import { DisasterInfo, PrepTask } from '@/types';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Share2,
  ListChecks
} from 'lucide-react-native';
import TaskCard from '@/components/TaskCard';
import Button from '@/components/Button';

export default function DisasterDetailsScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const { disasters, getDisasterByType } = useDisastersStore();
  const { tasks, getTasksByDisasterType } = useTasksStore();
  const [disaster, setDisaster] = useState<DisasterInfo | null>(null);
  const [relatedTasks, setRelatedTasks] = useState<PrepTask[]>([]);
  
  useEffect(() => {
    if (type) {
      const foundDisaster = getDisasterByType(type as string);
      if (foundDisaster) {
        setDisaster(foundDisaster);
        
        const disasterTasks = getTasksByDisasterType(type as string);
        setRelatedTasks(disasterTasks);
      }
    }
  }, [type, disasters, tasks]);
  
  const handleShare = () => {
    // In a real app, this would use the Share API
    console.log('Sharing disaster info:', disaster?.name);
  };
  
  const handleTaskPress = (taskId: string) => {
    router.push(`/task-details/${taskId}`);
  };
  
  if (!disaster) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading disaster information...</Text>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: disaster.name,
          headerRight: () => (
            <Share2 
              size={spacings.sectionSpacing} 
              color={colors.text} 
              style={{ marginRight: spacings.lg }}
              onPress={handleShare}
            />
          ),
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image
              source={disaster.imageUrl}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.overlay} />
            <Text style={styles.imageTitle}>{disaster.name}</Text>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.description}>{disaster.description}</Text>
            
            <View style={styles.tipsContainer}>
              <View style={styles.tipsHeader}>
                <Clock size={spacings.xl} color={colors.primary} />
                <Text style={styles.tipsTitle}>Before It Happens</Text>
              </View>
              
              {disaster.beforeTips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <CheckCircle size={spacings.lg} color={colors.primary} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.tipsContainer}>
              <View style={styles.tipsHeader}>
                <AlertTriangle size={spacings.xl} color={colors.warning} />
                <Text style={styles.tipsTitle}>During the Event</Text>
              </View>
              
              {disaster.duringTips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <CheckCircle size={spacings.lg} color={colors.warning} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.tipsContainer}>
              <View style={styles.tipsHeader}>
                <CheckCircle size={spacings.xl} color={colors.success} />
                <Text style={styles.tipsTitle}>After It's Over</Text>
              </View>
              
              {disaster.afterTips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <CheckCircle size={spacings.lg} color={colors.success} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
            
            {relatedTasks.length > 0 && (
              <View style={styles.relatedTasksContainer}>
                <View style={styles.relatedTasksHeader}>
                  <ListChecks size={spacings.xl} color={colors.text} />
                  <Text style={styles.relatedTasksTitle}>
                    Preparation Tasks
                  </Text>
                </View>
                
                {relatedTasks.slice(0, 3).map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onPress={() => handleTaskPress(task.id)} 
                  />
                ))}
                
                {relatedTasks.length > 3 && (
                  <Button
                    title="View All Tasks"
                    onPress={() => router.push('/prepare')}
                    variant="outline"
                    style={styles.viewAllButton}
                  />
                )}
              </View>
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
    position: 'relative',
  },
  image: {
    flex: 1,
    backgroundColor: colors.backgroundTertiary,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  imageTitle: {
    position: 'absolute',
    bottom: spacings.sectionSpacing,
    left: spacings.sectionSpacing,
    color: colors.textInverse,
    fontSize: spacings.fontSize.xxxl,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    padding: spacings.screenPadding,
  },
  description: {
    fontSize: spacings.fontSize.md,
    color: colors.textSecondary,
    lineHeight: spacings.sectionSpacing,
    marginBottom: spacings.sectionSpacing,
  },
  tipsContainer: {
    marginBottom: spacings.sectionSpacing,
    backgroundColor: colors.background,
    borderRadius: spacings.borderRadius.md,
    padding: spacings.screenPadding,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacings.lg,
  },
  tipsTitle: {
    fontSize: spacings.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacings.xs,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacings.md,
  },
  tipText: {
    flex: 1,
    fontSize: spacings.fontSize.md,
    color: colors.textSecondary,
    marginLeft: spacings.md,
    lineHeight: spacings.sectionSpacing,
  },
  relatedTasksContainer: {
    marginBottom: spacings.sectionSpacing,
  },
  relatedTasksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacings.lg,
  },
  relatedTasksTitle: {
    fontSize: spacings.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacings.xs,
  },
  viewAllButton: {
    marginTop: spacings.xs,
  },
});