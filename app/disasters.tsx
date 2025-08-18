import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
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
          <IconWrapper icon={Search} size={spacings.xl} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search disasters..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textTertiary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <IconWrapper icon={X} size={spacings.xl} color={colors.textTertiary} />
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
    paddingHorizontal: spacings.screenPadding,
    paddingTop: spacings.screenPadding,
    paddingBottom: spacings.sm,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: spacings.borderRadius.md,
    paddingHorizontal: spacings.screenPadding,
    paddingVertical: spacings.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacings.md,
    fontSize: spacings.fontSize.md,
    color: colors.text,
  },
  clearButton: {
    padding: spacings.xs,
  },
  categoryStyle:{
    marginBottom: spacings.sm,
  },
  resultsText: {
    fontSize: spacings.fontSize.sm,
    color: colors.text,
  },
  listContent: {
    paddingHorizontal: spacings.screenPadding,
    paddingBottom: spacings.xl,
  },
  separator: {
    height: spacings.md,
  },
});