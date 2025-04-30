import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Alert, AlertLevel } from '@/types';
import { alertLevelColors } from '@/constants/colors';
import { useAlertsStore } from '@/store/alerts-store';
import { Bell, Info, AlertTriangle, AlertOctagon } from 'lucide-react-native';
import IconWrapper from '@/components/IconWrapper';

interface AlertCardProps {
  alert: Alert;
  onPress?: () => void;
}

export default function AlertCard({ alert, onPress }: AlertCardProps) {
  const { markAlertAsViewed } = useAlertsStore();
  
  const handlePress = () => {
    markAlertAsViewed(alert.id);
    if (onPress) onPress();
  };
  
  const getAlertIcon = (level: AlertLevel) => {
    const color = alertLevelColors[level];
    const size = 24;
    
    switch (level) {
      case 'low':
        return <IconWrapper icon={Info} size={size} color={color} />;
      case 'medium':
        return <IconWrapper icon={Bell} size={size} color={color} />;
      case 'high':
        return <IconWrapper icon={AlertTriangle} size={size} color={color} />;
      case 'critical':
        return <IconWrapper icon={AlertOctagon} size={size} color={color} />;
      default:
        return <IconWrapper icon={Bell} size={size} color={color} />;
    }
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { borderLeftColor: alertLevelColors[alert.level] }
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {getAlertIcon(alert.level)}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{alert.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {alert.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.location}>{alert.location}</Text>
          <Text style={styles.date}>
            {new Date(alert.date).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
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
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1F2937',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  location: {
    fontSize: 12,
    color: '#6B7280',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
});