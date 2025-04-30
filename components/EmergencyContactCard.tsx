import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { EmergencyContact } from '@/types';
import { Phone, Mail, MapPin, Edit, Trash2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';

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
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 12,
  },
  relationship: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  localBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  localText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
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
  },
  contactText: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.text,
  },
});