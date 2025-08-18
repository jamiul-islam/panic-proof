import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { CustomChecklist } from '@/types';
import { useUserStore } from '@/store/user-store';
import { CheckCircle, Circle, ChevronRight, Edit } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
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
      case 'supplies': return colors.danger;
      case 'planning': return colors.primary;
      case 'skills': return colors.success;
      case 'home': return colors.warning;
      case 'personal': return colors.warning;
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
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>{checklist.points || 0} points</Text>
        </View>
        <IconWrapper icon={ChevronRight} size={16} color={colors.text} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: spacings.borderRadius.md,
    padding: spacings.cardPadding,
    marginBottom: spacings.lg,
    ...spacings.shadow,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacings.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIndicator: {
    width: 4,
    height: spacings.xl,
    borderRadius: spacings.borderRadius.xs / 2,
    marginRight: spacings.md,
  },
  title: {
    fontSize: spacings.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  description: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacings.md,
  },
  progressContainer: {
    marginBottom: spacings.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginBottom: spacings.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  itemsPreview: {
    marginBottom: spacings.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacings.xs,
  },
  itemText: {
    fontSize: spacings.fontSize.sm,
    color: colors.text,
    marginLeft: spacings.sm,
    flex: 1,
  },
  completedItemText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  moreItems: {
    fontSize: spacings.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacings.xs,
    marginLeft: spacings.xxl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsContainer: {
    backgroundColor: colors.primaryBadge,
    paddingHorizontal: spacings.sm + 2,
    paddingVertical: spacings.xs,
    borderRadius: spacings.borderRadius.md,
  },
  pointsText: {
    fontSize: spacings.fontSize.xs,
    color: colors.primary,
    fontWeight: '500',
  },
  category: {
    fontSize: spacings.fontSize.xs,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
