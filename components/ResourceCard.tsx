import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Resource } from '@/types';
import { Phone, Globe, MapPin, Mail } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const handlePhonePress = () => {
    if (resource.contactPhone) {
      Linking.openURL(`tel:${resource.contactPhone}`);
    }
  };
  
  const handleWebsitePress = () => {
    if (resource.website) {
      Linking.openURL(resource.website);
    }
  };
  
  const handleEmailPress = () => {
    if (resource.contactEmail) {
      Linking.openURL(`mailto:${resource.contactEmail}`);
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency':
        return colors.danger;
      case 'medical':
        return colors.success;
      case 'shelter':
        return '#8B5CF6';
      case 'food':
        return colors.warning;
      case 'utilities':
        return colors.primary;
      case 'transportation':
        return '#EC4899';
      case 'information':
        return '#6366F1';
      default:
        return colors.textSecondary;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View 
          style={[
            styles.categoryBadge, 
            { backgroundColor: getCategoryColor(resource.category) }
          ]}
        >
          <Text style={styles.categoryText}>
            {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.title}>{resource.title}</Text>
      <Text style={styles.description}>{resource.description}</Text>
      
      <View style={styles.contactContainer}>
        {resource.contactPhone && (
          <TouchableOpacity 
            style={styles.contactButton} 
            onPress={handlePhonePress}
          >
            <Phone size={16} color={colors.primary} />
            <Text style={styles.contactText}>{resource.contactPhone}</Text>
          </TouchableOpacity>
        )}
        
        {resource.website && (
          <TouchableOpacity 
            style={styles.contactButton} 
            onPress={handleWebsitePress}
          >
            <Globe size={16} color={colors.primary} />
            <Text style={styles.contactText}>Website</Text>
          </TouchableOpacity>
        )}
        
        {resource.contactEmail && (
          <TouchableOpacity 
            style={styles.contactButton} 
            onPress={handleEmailPress}
          >
            <Mail size={16} color={colors.primary} />
            <Text style={styles.contactText}>Email</Text>
          </TouchableOpacity>
        )}
        
        {resource.address && (
          <View style={styles.contactButton}>
            <MapPin size={16} color={colors.primary} />
            <Text style={styles.contactText} numberOfLines={2}>{resource.address}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: spacings.borderRadius.md,
    padding: spacings.cardPadding,
    marginBottom: spacings.lg,
    ...spacings.lightShadow,
  },
  header: {
    flexDirection: 'row',
    marginBottom: spacings.md,
  },
  categoryBadge: {
    paddingHorizontal: spacings.sm + 2,
    paddingVertical: spacings.xs,
    borderRadius: spacings.borderRadius.md,
  },
  categoryText: {
    color: colors.textInverse,
    fontSize: spacings.fontSize.xs,
    fontWeight: '500',
  },
  title: {
    fontSize: spacings.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacings.sm,
  },
  description: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacings.lg,
  },
  contactContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacings.sm,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacings.md,
    paddingVertical: spacings.sm,
    borderRadius: spacings.borderRadius.sm,
    marginRight: spacings.sm,
    marginBottom: spacings.sm,
  },
  contactText: {
    marginLeft: 6,
    fontSize: spacings.fontSize.sm,
    color: colors.text,
  },
});