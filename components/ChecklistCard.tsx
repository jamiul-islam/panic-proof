import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { CustomChecklist } from '@/types';
import { useUserStore } from '@/store/user-store';
import { CheckCircle, Circle, ChevronRight, Edit } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import IconWrapper from '@/components/IconWrapper';

interface ChecklistCardProps {
  checklist: CustomChecklist;
  onPress?: () => void;
  onEdit?: () => void;
}

export default function ChecklistCard({ checklist, onPress, onEdit }: ChecklistCardProps) {
  const { toggleChecklistItem } = useUserStore();
  
  const completedItems = checklist.items.filter(item => item.isCompleted).length;
  const totalItems = checklist.items.length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'supplies': return '#EF4444';
      case 'planning': return '#3B82F6';
      case 'skills': return '#10B981';
      case 'home': return '#F59E0B';
      case 'personal': return '#8B5CF6';
      default: return colors.primary;
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(checklist.category) }]} />
          <Text style={styles.title} numberOfLines={1}>{checklist.title}</Text>
        </View>
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconWrapper icon={Edit} size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      {checklist.description && (
        <Text style={styles.description} numberOfLines={2}>
          {checklist.description}
        </Text>
      )}
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${progressPercentage}%`,
                backgroundColor: getCategoryColor(checklist.category)
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {completedItems}/{totalItems} completed
        </Text>
      </View>
      
      <View style={styles.itemsPreview}>
        {checklist.items.slice(0, 3).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.itemRow}
            onPress={(e) => {
              e.stopPropagation();
              toggleChecklistItem(checklist.id, item.id);
            }}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          >
            {item.isCompleted ? (
              <IconWrapper icon={CheckCircle} size={16} color={colors.success} />
            ) : (
              <IconWrapper icon={Circle} size={16} color={colors.text} />
            )}
            <Text 
              style={[
                styles.itemText,
                item.isCompleted && styles.completedItemText
              ]} 
              numberOfLines={1}
            >
              {item.text}
            </Text>
          </TouchableOpacity>
        ))}
        {checklist.items.length > 3 && (
          <Text style={styles.moreItems}>+{checklist.items.length - 3} more items</Text>
        )}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.category}>{checklist.category.toUpperCase()}</Text>
        <IconWrapper icon={ChevronRight} size={16} color={colors.text} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  itemsPreview: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  completedItemText: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  moreItems: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginLeft: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
});
