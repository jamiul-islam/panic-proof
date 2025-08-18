import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useAlertsStore } from '@/store/alerts-store';
import { Alert as AlertType } from '@/types';
import { alertLevelColors } from '@/constants/colors';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Info, 
  CheckCircle,
  Share2
} from 'lucide-react-native';
import Button from '@/components/Button';

export default function AlertDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { alerts, markAlertAsViewed } = useAlertsStore();
  const [alert, setAlert] = useState<AlertType | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundAlert = alerts.find(a => a.id === id);
      if (foundAlert) {
        setAlert(foundAlert);
        markAlertAsViewed(foundAlert.id);
      }
    }
  }, [id, alerts]);
  
  const handleShare = () => {
    // In a real app, this would use the Share API
    console.log('Sharing alert:', alert?.title);
  };
  
  const handleViewDisasterInfo = () => {
    if (alert) {
      router.push(`/disaster-details/${alert.type}`);
    }
  };
  
  if (!alert) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading alert details...</Text>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: alert.title,
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
          <View 
            style={[
              styles.alertBanner,
              { backgroundColor: alertLevelColors[alert.level] }
            ]}
          >
            <AlertTriangle size={spacings.sectionSpacing} color={colors.textInverse} />
            <Text style={styles.alertLevel}>
              {alert.level.charAt(0).toUpperCase() + alert.level.slice(1)} Alert
            </Text>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.description}>{alert.description}</Text>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <MapPin size={spacings.xl} color={colors.textSecondary} />
                <Text style={styles.infoText}>{alert.location}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Clock size={spacings.xl} color={colors.textSecondary} />
                <Text style={styles.infoText}>
                  {new Date(alert.date).toLocaleString()}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Info size={spacings.xl} color={colors.textSecondary} />
                <Text style={styles.infoText}>Source: {alert.source}</Text>
              </View>
            </View>
            
            {alert.instructions && alert.instructions.length > 0 && (
              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsTitle}>What to do:</Text>
                
                {alert.instructions.map((instruction, index) => (
                  <View key={index} style={styles.instructionItem}>
                    <CheckCircle size={spacings.xl} color={alertLevelColors[alert.level]} />
                    <Text style={styles.instructionText}>{instruction}</Text>
                  </View>
                ))}
              </View>
            )}
            
            <Button
              title={`Learn more about ${alert.type.replace('_', ' ')}`}
              onPress={handleViewDisasterInfo}
              variant="outline"
              style={styles.learnMoreButton}
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
    backgroundColor: colors.card,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacings.md,
    backgroundColor: colors.danger,
  },
  alertLevel: {
    color: colors.textInverse,
    fontSize: spacings.fontSize.md,
    fontWeight: '600',
    marginLeft: spacings.xs,
  },
  content: {
    padding: spacings.screenPadding,
  },
  description: {
    fontSize: spacings.fontSize.lg,
    color: colors.text,
    marginBottom: spacings.sectionSpacing,
    lineHeight: spacings.fontSize.lg + spacings.xs,
  },
  infoContainer: {
    backgroundColor: colors.background,
    borderRadius: spacings.borderRadius.xs,
    padding: spacings.screenPadding,
    marginBottom: spacings.sectionSpacing,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacings.md,
  },
  infoText: {
    fontSize: spacings.fontSize.md,
    color: colors.textSecondary,
    marginLeft: spacings.md,
  },
  instructionsContainer: {
    marginBottom: spacings.sectionSpacing,
  },
  instructionsTitle: {
    fontSize: spacings.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacings.lg,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacings.md,
  },
  instructionText: {
    fontSize: spacings.fontSize.md,
    color: colors.textSecondary,
    marginLeft: spacings.md,
    flex: 1,
    lineHeight: spacings.sectionSpacing,
  },
  learnMoreButton: {
    marginTop: spacings.xs,
  },
});