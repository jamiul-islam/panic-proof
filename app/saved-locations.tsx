import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
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
                <IconWrapper icon={MapPin} size={spacings.xxxxl + spacings.sm} color={colors.textTertiary} />
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
            icon={<IconWrapper icon={Plus} size={spacings.xl} color={colors.textInverse} />}
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
    padding: spacings.screenPadding,
  },
  description: {
    fontSize: spacings.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacings.screenPadding,
    lineHeight: spacings.xl + spacings.xs / 2,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: spacings.screenPadding,
  },
  addButton: {
    marginTop: spacings.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacings.xxxxl + spacings.sm,
    paddingHorizontal: spacings.xxxl,
  },
  emptyStateTitle: {
    fontSize: spacings.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacings.screenPadding,
    marginBottom: spacings.sm,
  },
  emptyStateText: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: spacings.xl,
  },
});