import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { DisasterInfo } from '@/types';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';

interface DisasterCardProps {
  disaster: DisasterInfo;
  onPress?: () => void;
  variant?: 'horizontal' | 'wide';
}

export default function DisasterCard({ disaster, onPress, variant = 'horizontal' }: DisasterCardProps) {
  const isWide = variant === 'wide';
  
  return (
    <TouchableOpacity 
      style={[styles.container, isWide && styles.wideContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.imageContainer, isWide && styles.wideImageContainer]}>
        <Image
          source={disaster.imageUrl}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.overlay} />
        <Text style={styles.title}>{disaster.name}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.description, isWide && styles.wideDescription]} numberOfLines={isWide ? 3 : 2}>
          {disaster.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.learnMore}>Learn more</Text>
          <ChevronRight size={16} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: spacings.borderRadius.md,
    marginBottom: spacings.lg,
    overflow: 'hidden',
    width: 280,
    marginRight: spacings.lg,
    ...spacings.shadow,
  },
  wideContainer: {
    width: '100%',
    marginRight: 0,
  },
  imageContainer: {
    height: 140,
    width: '100%',
    position: 'relative',
  },
  wideImageContainer: {
    height: 180,
  },
  image: {
    flex: 1,
    backgroundColor: colors.border,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  title: {
    position: 'absolute',
    bottom: spacings.md,
    left: spacings.md,
    color: colors.textInverse,
    fontSize: spacings.fontSize.xl,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    padding: spacings.cardPadding,
  },
  description: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacings.md,
  },
  wideDescription: {
    fontSize: spacings.fontSize.md - 1,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learnMore: {
    fontSize: spacings.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
    marginRight: spacings.xs,
  },
});