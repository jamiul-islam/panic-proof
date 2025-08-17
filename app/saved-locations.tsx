import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { MapPin, Edit, Trash2, Plus } from 'lucide-react-native';
import IconWrapper from '@/components/IconWrapper';
import Button from '@/components/Button';
import { useUserStore } from '@/store/user-store';
import { SavedLocation } from '@/types';
import SavedLocationCard from '@/components/SavedLocationCard';

export default function SavedLocationsScreen() {
  const router = useRouter();
  const { profile, removeSavedLocation, updateSavedLocation } = useUserStore();
  const savedLocations = profile?.savedLocations || [];
  
  const handleAddLocation = () => {
    router.push('/add-location');
  };
  
  const handleEditLocation = (id: string) => {
    router.push(`/edit-location/${id}`);
  };
  
  const handleDeleteLocation = (id: string) => {
    Alert.alert(
      "Delete Location",
      "Are you sure you want to delete this location?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeSavedLocation(id);
          }
        }
      ]
    );
  };
  
  const handleSetPrimary = (id: string) => {
    // First, set all locations to non-primary
    savedLocations.forEach(location => {
      if (location.isPrimary) {
        updateSavedLocation(location.id, { isPrimary: false });
      }
    });
    
    // Then set the selected location as primary
    updateSavedLocation(id, { isPrimary: true });
  };
  
  const renderLocationItem = ({ item }: { item: SavedLocation }) => (
    <SavedLocationCard
      location={item}
      onEdit={() => handleEditLocation(item.id)}
      onDelete={() => handleDeleteLocation(item.id)}
      onSetPrimary={() => handleSetPrimary(item.id)}
    />
  );
  
  return (
    <>
      <Stack.Screen options={{ 
        title: "Saved Locations",
        headerBackTitle: "",
      }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Save locations to receive alerts and recommendations specific to those areas.
          </Text>
          
          <FlatList
            data={savedLocations}
            renderItem={renderLocationItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <IconWrapper icon={MapPin} size={48} color="#9CA3AF" />
                <Text style={styles.emptyStateTitle}>No Saved Locations</Text>
                <Text style={styles.emptyStateText}>
                  Add your first location to get started with personalized alerts and recommendations.
                </Text>
              </View>
            )}
          />
          
          <Button
            title="Add New Location"
            onPress={handleAddLocation}
            variant="primary"
            icon={<IconWrapper icon={Plus} size={20} color="#fff" />}
            iconPosition="left"
            style={styles.addButton}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 22,
  },
  listContent: {
    paddingBottom: 16,
  },
  addButton: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});