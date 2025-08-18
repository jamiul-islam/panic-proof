import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Alert, AlertLevel } from '@/types';
import { alertLevelColors, colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
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
    backgroundColor: colors.card,
    borderRadius: spacings.borderRadius.md,
    padding: spacings.screenPadding,
    marginBottom: spacings.md,
    borderLeftWidth: 4,
    ...spacings.lightShadow,
  },
  iconContainer: {
    marginRight: spacings.md,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: spacings.fontSize.md,
    fontWeight: '600',
    marginBottom: spacings.xs,
    color: colors.text,
  },
  description: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacings.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  location: {
    fontSize: spacings.fontSize.xs,
    color: colors.textSecondary,
  },
  date: {
    fontSize: spacings.fontSize.xs,
    color: colors.textSecondary,
  },
});