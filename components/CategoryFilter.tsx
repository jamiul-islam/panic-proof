import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';

interface CategoryFilterProps {
  categories: { id: string; name: string }[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.categoryButton,
          selectedCategory === null && styles.selectedCategory
        ]}
        onPress={() => onSelectCategory(null)}
      >
        <Text
          style={[
            styles.categoryText,
            selectedCategory === null && styles.selectedCategoryText
          ]}
        >
          All
        </Text>
      </TouchableOpacity>
      
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            selectedCategory === category.id && styles.selectedCategory
          ]}
          onPress={() => onSelectCategory(category.id)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category.id && styles.selectedCategoryText
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacings.screenPadding,
    paddingVertical: spacings.lg,
    gap: spacings.sm,
  },
  categoryButton: {
    paddingHorizontal: spacings.lg,
    paddingVertical: spacings.sm,
    borderRadius: spacings.borderRadius.xl,
    backgroundColor: colors.backgroundSecondary,
    marginRight: spacings.sm,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: spacings.fontSize.sm,
    color: colors.text,
    fontWeight: '400',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: colors.textInverse,
    fontWeight: '500',
  },
});