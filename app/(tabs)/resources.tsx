import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResourcesStore } from '@/store/resources-store';
import { Search, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
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
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search resources..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <X
              size={20}
              color="#9CA3AF"
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: 16,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: colors.text,
  },
  clearIcon: {
    padding: 4,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
});