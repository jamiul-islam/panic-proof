import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAlertsStore } from '@/store/alerts-store';
import { SearchX } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import AlertCard from '@/components/AlertCard';
import EmptyState from '@/components/EmptyState';
import CategoryFilter from '@/components/CategoryFilter';

export default function AlertsScreen() {
  const router = useRouter();
  const { 
    alerts, 
    fetchAlerts, 
    subscribeToAlerts, 
    unsubscribeFromAlerts, 
    getActiveAlerts,
    isLoading,
    error 
  } = useAlertsStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch initial data
    fetchAlerts();
    
    // Set up real-time subscription
    subscribeToAlerts();
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribeFromAlerts();
    };
  }, [fetchAlerts, subscribeToAlerts, unsubscribeFromAlerts]);
  
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

  // Show loading state
  if (isLoading && alerts.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading alerts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Failed to load alerts</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }
  
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
          icon={<SearchX size={spacings.xxxxxl} color={colors.textTertiary} />}
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
    padding: spacings.screenPadding,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacings.screenPadding,
  },
  loadingText: {
    fontSize: spacings.fontSize.lg,
    color: colors.text,
    textAlign: 'center',
  },
  errorText: {
    fontSize: spacings.fontSize.lg,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacings.sm,
  },
  errorSubtext: {
    fontSize: spacings.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});