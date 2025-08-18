import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  Platform 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUserStore } from '@/store/user-store';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import { CustomChecklist, ChecklistItem } from '@/types';
import { X, Plus, Trash2 } from 'lucide-react-native';
import Button from '@/components/Button';
import IconWrapper from '@/components/IconWrapper';

export default function ModalScreen() {
  const router = useRouter();
  const { checklistId } = useLocalSearchParams();
  const { profile, addCustomChecklist, updateCustomChecklist } = useUserStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [points, setPoints] = useState('');
  const [category, setCategory] = useState<'supplies' | 'planning' | 'skills' | 'home' | 'personal'>('personal');
  const [items, setItems] = useState<ChecklistItem[]>([{ id: '1', text: '', isCompleted: false }]);
  
  const isEditing = !!checklistId;
  
  useEffect(() => {
    if (isEditing && profile) {
      const checklist = profile.customChecklists.find(c => c.id === checklistId);
      if (checklist) {
        setTitle(checklist.title);
        setDescription(checklist.description);
        setImageUrl(checklist.imageUrl || '');
        setPoints(checklist.points?.toString() || '');
        setCategory(checklist.category);
        setItems(checklist.items.length > 0 ? checklist.items : [{ id: '1', text: '', isCompleted: false }]);
      }
    }
  }, [checklistId, profile]);
  
  const categories = [
    { id: 'supplies', name: 'Supplies', color: colors.danger },
    { id: 'planning', name: 'Planning', color: colors.primary },
    { id: 'skills', name: 'Skills', color: colors.success },
    { id: 'home', name: 'Home', color: colors.warning },
    { id: 'personal', name: 'Personal', color: '#8B5CF6' },
  ] as const;
  
  const addItem = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: '',
      isCompleted: false,
    };
    setItems([...items, newItem]);
  };
  
  const removeItem = (itemId: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== itemId));
    }
  };
  
  const updateItem = (itemId: string, text: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, text } : item
    ));
  };
  
  const getDefaultImageUrl = (category: string) => {
    switch (category) {
      case 'supplies': return 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400';
      case 'planning': return 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400';
      case 'skills': return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400';
      case 'home': return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400';
      case 'personal': return 'https://images.unsplash.com/photo-1494790108755-2616c9de1f96?w=400';
      default: return 'https://images.unsplash.com/photo-1494790108755-2616c9de1f96?w=400';
    }
  };
  
  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your checklist.');
      return;
    }
    
    const nonEmptyItems = items.filter(item => item.text.trim());
    if (nonEmptyItems.length === 0) {
      Alert.alert('Error', 'Please add at least one item to your checklist.');
      return;
    }
    
    const now = new Date().toISOString();
    const finalImageUrl = imageUrl.trim() || getDefaultImageUrl(category);
    const checklistPoints = points ? parseInt(points, 10) : (nonEmptyItems.length * 10);
    
    if (isEditing) {
      const updates: Partial<CustomChecklist> = {
        title: title.trim(),
        description: description.trim(),
        category,
        items: nonEmptyItems,
        imageUrl: finalImageUrl,
        points: checklistPoints,
        isCompleted: nonEmptyItems.every(item => item.isCompleted),
      };
      updateCustomChecklist(checklistId as string, updates);
    } else {
      const newChecklist: CustomChecklist = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        category,
        items: nonEmptyItems,
        imageUrl: finalImageUrl,
        points: checklistPoints,
        isCompleted: false,
        createdAt: now,
        updatedAt: now,
      };
      addCustomChecklist(newChecklist);
    }
    
    Alert.alert(
      'Success',
      `Checklist ${isEditing ? 'updated' : 'created'} successfully!`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconWrapper icon={X} size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Checklist' : 'New Checklist'}
        </Text>
        <View style={{ width: spacings.sectionSpacing }} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter checklist title"
            placeholderTextColor={colors.textTertiary}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description (optional)"
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Image URL (Optional)</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="Enter image URL or leave empty for default"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            keyboardType="url"
          />
          <Text style={styles.helperText}>
            Leave empty to use a default image based on category
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Points (Optional)</Text>
          <TextInput
            style={styles.input}
            value={points}
            onChangeText={setPoints}
            placeholder="Enter points value or leave empty for auto-calculation"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
          />
          <Text style={styles.helperText}>
            Leave empty to automatically calculate (10 points per item)
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  category === cat.id && { backgroundColor: cat.color, borderColor: cat.color }
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={[
                  styles.categoryText,
                  category === cat.id && styles.selectedCategoryText
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.itemsHeader}>
            <Text style={styles.label}>Items *</Text>
            <TouchableOpacity style={styles.addButton} onPress={addItem}>
              <IconWrapper icon={Plus} size={20} color={colors.primary} />
              <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
          
          {items.map((item, index) => (
            <View key={item.id} style={styles.itemContainer}>
              <TextInput
                style={styles.itemInput}
                value={item.text}
                onChangeText={(text) => updateItem(item.id, text)}
                placeholder={`Item ${index + 1}`}
                placeholderTextColor={colors.textTertiary}
              />
              {items.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeItem(item.id)}
                >
                  <IconWrapper icon={Trash2} size={spacings.screenPadding} color={colors.danger} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title={isEditing ? 'Update Checklist' : 'Create Checklist'}
          onPress={handleSave}
          style={styles.saveButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacings.screenPadding,
    paddingVertical: spacings.screenPadding,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: spacings.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: spacings.screenPadding,
  },
  section: {
    marginBottom: spacings.sectionSpacing,
  },
  label: {
    fontSize: spacings.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacings.sm,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: spacings.borderRadius.sm,
    padding: spacings.md,
    fontSize: spacings.fontSize.md,
    color: colors.text,
  },
  helperText: {
    fontSize: spacings.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacings.xs,
  },
  textArea: {
    height: spacings.xxxxl * 2,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacings.sm,
  },
  categoryChip: {
    paddingHorizontal: spacings.screenPadding,
    paddingVertical: spacings.sm,
    borderRadius: spacings.xl,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    backgroundColor: colors.card,
  },
  categoryText: {
    fontSize: spacings.fontSize.sm,
    color: colors.text,
  },
  selectedCategoryText: {
    color: colors.textInverse,
    fontWeight: '500',
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacings.md,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacings.md,
    paddingVertical: spacings.xs * 1.5,
    borderRadius: spacings.xs * 1.5,
    backgroundColor: colors.primaryBadge,
  },
  addButtonText: {
    fontSize: spacings.fontSize.sm,
    color: colors.primary,
    marginLeft: spacings.xs,
    fontWeight: '500',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacings.sm,
  },
  itemInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: spacings.borderRadius.sm,
    padding: spacings.md,
    fontSize: spacings.fontSize.md,
    color: colors.text,
  },
  removeButton: {
    marginLeft: spacings.sm,
    padding: spacings.sm,
  },
  footer: {
    padding: spacings.screenPadding,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    width: '100%',
  },
});
