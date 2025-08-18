import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useResourcesStore } from '@/store/resources-store';
import { Search, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import ResourceCard from '@/components/ResourceCard';
import CategoryFilter from '@/components/CategoryFilter';

export default function ResourcesScreen() {
  const { resources, fetchResources } = useResourcesStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchResources();
  }, []);
  
  const resourceCategories = [
    { id: 'emergency', name: 'Emergency' },
    { id: 'medical', name: 'Medical' },
    { id: 'shelter', name: 'Shelter' },
    { id: 'food', name: 'Food' },
    { id: 'utilities', name: 'Utilities' },
    { id: 'transportation', name: 'Transport' },
    { id: 'information', name: 'Information' },
  ];
  
  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory ? resource.category === selectedCategory : true;
    const matchesSearch = searchQuery
      ? resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    return matchesCategory && matchesSearch;
  });
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: "Resources",
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: spacings.fontSize.lg,
          },
          headerShadowVisible: false,
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={spacings.xl} color={colors.textTertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search resources..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textTertiary}
          />
          {searchQuery.length > 0 && (
            <X
              size={spacings.xl}
              color={colors.textTertiary}
              style={styles.clearIcon}
              onPress={clearSearch}
            />
          )}
        </View>
      </View>
      
      <CategoryFilter
        categories={resourceCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <FlatList
        data={filteredResources}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ResourceCard resource={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: spacings.screenPadding,
    backgroundColor: colors.card,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: spacings.borderRadius.sm,
    paddingHorizontal: spacings.md,
  },
  searchIcon: {
    marginRight: spacings.sm,
  },
  searchInput: {
    flex: 1,
    height: spacings.heights.input,
    fontSize: spacings.fontSize.md,
    color: colors.text,
  },
  clearIcon: {
    padding: spacings.xs,
  },
  listContent: {
    padding: spacings.screenPadding,
    paddingTop: spacings.sm,
  },
});