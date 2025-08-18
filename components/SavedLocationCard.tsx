import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SavedLocation } from '@/types';
import { Home, Briefcase, Heart, MapPin, Edit, Trash2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import IconWrapper from './IconWrapper';

interface SavedLocationCardProps {
  location: SavedLocation;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetPrimary?: () => void;
}

export default function SavedLocationCard({ 
  location, 
  onEdit, 
  onDelete,
  onSetPrimary 
}: SavedLocationCardProps) {
  
  const getLocationIcon = () => {
    switch (location.type) {
      case 'home':
        return Home;
      case 'work':
        return Briefcase;
      case 'favorite':
        return Heart;
      default:
        return MapPin;
    }
  };

  const getLocationColor = () => {
    switch (location.type) {
      case 'home':
        return colors.primary;
      case 'work':
        return colors.secondary;
      case 'favorite':
        return colors.danger;
      default:
        return colors.text;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationInfo}>
          <View style={styles.iconContainer}>
            <IconWrapper 
              icon={getLocationIcon()} 
              size={20} 
              color={getLocationColor()} 
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{location.name}</Text>
            <Text style={styles.address} numberOfLines={2}>
              {location.address}
            </Text>
          </View>
        </View>
        
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={onEdit}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconWrapper icon={Edit} size={16} color={colors.text} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={onDelete}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconWrapper icon={Trash2} size={16} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.footer}>
        {location.isPrimary ? (
          <View style={styles.primaryBadge}>
            <Text style={styles.primaryText}>Primary Location</Text>
          </View>
        ) : onSetPrimary ? (
          <TouchableOpacity 
            style={styles.setPrimaryButton}
            onPress={onSetPrimary}
          >
            <Text style={styles.setPrimaryText}>Set as Primary</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: spacings.borderRadius.md,
    padding: spacings.cardPadding,
    marginBottom: spacings.md,
    ...spacings.lightShadow,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacings.md,
  },
  locationInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: spacings.borderRadius.xl,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacings.md,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: spacings.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacings.xs,
  },
  address: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacings.sm,
  },
  actionButton: {
    padding: spacings.sm,
    borderRadius: 6,
    backgroundColor: colors.background,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacings.md,
  },
  primaryBadge: {
    backgroundColor: colors.primaryBadge,
    paddingVertical: spacings.xs + 2,
    paddingHorizontal: spacings.md,
    borderRadius: spacings.borderRadius.lg,
    alignSelf: 'flex-start',
  },
  primaryText: {
    fontSize: spacings.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  setPrimaryButton: {
    paddingVertical: spacings.xs + 2,
  },
  setPrimaryText: {
    fontSize: spacings.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
});
