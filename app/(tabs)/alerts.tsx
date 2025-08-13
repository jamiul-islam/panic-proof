import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAlertsStore } from '@/store/alerts-store';
import { Alert as AlertIcon, SearchX } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import AlertCard from '@/components/AlertCard';
import EmptyState from '@/components/EmptyState';
import CategoryFilter from '@/components/CategoryFilter';

export default function AlertsScreen() {
  const router = useRouter();
  const { alerts, fetchAlerts, getActiveAlerts } = useAlertsStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    fetchAlerts();
  }, []);
  
  const activeAlerts = getActiveAlerts();
  
  const alertCategories = [
    { id: 'high', name: 'High Priority' },
    { id: 'medium', name: 'Medium Priority' },
    { id: 'low', name: 'Low Priority' },
  ];
  
  const filteredAlerts = selectedCategory
    ? activeAlerts.filter(alert => alert.level === selectedCategory)
    : activeAlerts;
  
  const handleAlertPress = (alertId: string) => {
    router.push(`/alert-details/${alertId}`);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <CategoryFilter
        categories={alertCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      {filteredAlerts.length > 0 ? (
        <FlatList
          data={filteredAlerts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AlertCard 
              alert={item} 
              onPress={() => handleAlertPress(item.id)} 
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          title="No Active Alerts"
          message={
            selectedCategory
              ? `There are no active ${selectedCategory} priority alerts at this time.`
              : "There are no active alerts in your area at this time."
          }
          icon={<SearchX size={48} color="#9CA3AF" />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
});