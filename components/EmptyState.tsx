import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, message, icon }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacings.xxl,
  },
  iconContainer: {
    marginBottom: spacings.lg,
  },
  title: {
    fontSize: spacings.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacings.sm,
  },
  message: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
  },
});