import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import DisasterCard from '@/components/DisasterCard';
import CategoryFilter from '@/components/CategoryFilter';
import IconWrapper from '@/components/IconWrapper';
import { disasterInfo } from '@/mocks/disasters';
import { DisasterInfo } from '@/types';

export default function DisastersScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const disasterCategories = [
    { id: 'natural', name: 'Natural' },
    { id: 'weather', name: 'Weather' },
    { id: 'geological', name: 'Geological' },
    { id: 'biological', name: 'Biological' },
  ];
  
  const filteredDisasters = disasterInfo.filter((disaster: DisasterInfo) => {
    const matchesCategory = selectedCategory ? disaster.category === selectedCategory : true;
    const matchesSearch = searchQuery
      ? disaster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        disaster.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    return matchesCategory && matchesSearch;
  });
  
  const handleDisasterPress = (disasterType: string) => {
    router.push(`/disaster-details/${disasterType}`);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <IconWrapper icon={Search} size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search disasters..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <IconWrapper icon={X} size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.categoryStyle}>
        <CategoryFilter      
          categories={disasterCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}        
        />      
      </View>
      
      <FlatList
        data={filteredDisasters}
        keyExtractor={(item) => item.type}
        renderItem={({ item }) => (
          <DisasterCard 
            disaster={item} 
            onPress={() => handleDisasterPress(item.type)}
            variant="wide"
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    padding: 4,
  },
  categoryStyle:{
    marginBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: colors.text,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
});