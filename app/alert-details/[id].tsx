import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useAlertsStore } from '@/store/alerts-store';
import { Alert as AlertType } from '@/types';
import { alertLevelColors } from '@/constants/colors';
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
          <View 
            style={[
              styles.alertBanner,
              { backgroundColor: alertLevelColors[alert.level] }
            ]}
          >
            <AlertTriangle size={24} color="#fff" />
            <Text style={styles.alertLevel}>
              {alert.level.charAt(0).toUpperCase() + alert.level.slice(1)} Alert
            </Text>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.description}>{alert.description}</Text>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <MapPin size={20} color="#6B7280" />
                <Text style={styles.infoText}>{alert.location}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Clock size={20} color="#6B7280" />
                <Text style={styles.infoText}>
                  {new Date(alert.date).toLocaleString()}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Info size={20} color="#6B7280" />
                <Text style={styles.infoText}>Source: {alert.source}</Text>
              </View>
            </View>
            
            {alert.instructions && alert.instructions.length > 0 && (
              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsTitle}>What to do:</Text>
                
                {alert.instructions.map((instruction, index) => (
                  <View key={index} style={styles.instructionItem}>
                    <CheckCircle size={20} color={alertLevelColors[alert.level]} />
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
    backgroundColor: '#fff',
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
    paddingVertical: 12,
    backgroundColor: '#EF4444',
  },
  alertLevel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 24,
    lineHeight: 26,
  },
  infoContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 12,
  },
  instructionsContainer: {
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 12,
    flex: 1,
    lineHeight: 24,
  },
  learnMoreButton: {
    marginTop: 8,
  },
});