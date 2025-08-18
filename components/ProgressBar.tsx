import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  label?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({ 
  progress, 
  height = 8, 
  label, 
  showPercentage = false 
}: ProgressBarProps) {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {showPercentage && (
            <Text style={styles.percentage}>{Math.round(clampedProgress)}%</Text>
          )}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View 
          style={[
            styles.progress, 
            { 
              width: `${clampedProgress}%`,
              height 
            }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacings.sm,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacings.xs,
  },
  label: {
    fontSize: spacings.fontSize.sm,
    color: colors.text,
    fontWeight: '500',
  },
  percentage: {
    fontSize: spacings.fontSize.sm,
    color: colors.text,
    fontWeight: '500',
  },
  track: {
    backgroundColor: colors.border,
    borderRadius: spacings.borderRadius.xs,
    overflow: 'hidden',
  },
  progress: {
    backgroundColor: colors.primary,
    borderRadius: spacings.borderRadius.xs,
  },
});