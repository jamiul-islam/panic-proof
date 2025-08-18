import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { EmergencyContact } from '@/types';
import { Phone, Mail, MapPin, Edit, Trash2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';

interface EmergencyContactCardProps {
  contact: EmergencyContact;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function EmergencyContactCard({ 
  contact, 
  onEdit, 
  onDelete 
}: EmergencyContactCardProps) {
  const handlePhonePress = () => {
    Linking.openURL(`tel:${contact.phone}`);
  };
  
  const handleEmailPress = () => {
    if (contact.email) {
      Linking.openURL(`mailto:${contact.email}`);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{contact.name}</Text>
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={onEdit}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Edit size={16} color={colors.text} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={onDelete}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Trash2 size={16} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <Text style={styles.relationship}>{contact.relationship}</Text>
      
      {contact.isLocal && (
        <View style={styles.localBadge}>
          <MapPin size={12} color="#fff" />
          <Text style={styles.localText}>Local</Text>
        </View>
      )}
      
      <View style={styles.contactContainer}>
        <TouchableOpacity 
          style={styles.contactButton} 
          onPress={handlePhonePress}
        >
          <Phone size={16} color={colors.primary} />
          <Text style={styles.contactText}>{contact.phone}</Text>
        </TouchableOpacity>
        
        {contact.email && (
          <TouchableOpacity 
            style={styles.contactButton} 
            onPress={handleEmailPress}
          >
            <Mail size={16} color={colors.primary} />
            <Text style={styles.contactText}>{contact.email}</Text>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacings.xs,
  },
  name: {
    fontSize: spacings.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: spacings.md,
  },
  relationship: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacings.md,
  },
  localBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: spacings.sm,
    paddingVertical: spacings.xs,
    borderRadius: spacings.borderRadius.md,
    alignSelf: 'flex-start',
    marginBottom: spacings.md,
  },
  localText: {
    color: colors.textInverse,
    fontSize: spacings.fontSize.xs,
    fontWeight: '500',
    marginLeft: spacings.xs,
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
  },
  contactText: {
    marginLeft: 6,
    fontSize: spacings.fontSize.sm,
    color: colors.text,
  },
});