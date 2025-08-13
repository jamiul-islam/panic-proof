import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SavedLocation } from '@/types';
import { Home, Briefcase, Heart, MapPin, Edit, Trash2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  primaryBadge: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  primaryText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  setPrimaryButton: {
    paddingVertical: 6,
  },
  setPrimaryText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});
