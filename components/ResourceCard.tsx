import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Resource } from '@/types';
import { Phone, Globe, MapPin, Mail } from 'lucide-react-native';
import { colors } from '@/constants/colors';

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
        return '#EF4444';
      case 'medical':
        return '#10B981';
      case 'shelter':
        return '#8B5CF6';
      case 'food':
        return '#F59E0B';
      case 'utilities':
        return '#3B82F6';
      case 'transportation':
        return '#EC4899';
      case 'information':
        return '#6366F1';
      default:
        return '#6B7280';
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
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 16,
  },
  contactContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.text,
  },
});