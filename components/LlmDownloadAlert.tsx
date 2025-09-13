import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, Alert } from 'react-native';
import { Pause, Play, Download } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import ProgressBar from '@/components/ProgressBar';
import Button from '@/components/Button';
import IconWrapper from '@/components/IconWrapper';

interface LlmDownloadAlertProps {
  visible: boolean;
  onClose: () => void;
}

export default function LlmDownloadAlert({ visible, onClose }: LlmDownloadAlertProps) {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = () => {
    clearTimer();
    setProgress(0);
    setIsPaused(false);
  };

  useEffect(() => {
    if (visible && !isPaused && progress < 100) {
      clearTimer();
      intervalRef.current = setInterval(() => {
        setProgress((prev) => Math.min(prev + 2, 100));
      }, 120);
    } else {
      clearTimer();
    }
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, isPaused]);

  useEffect(() => {
    if (!visible) return;
    if (progress >= 100) {
      clearTimer();
      const t = setTimeout(() => {
        Alert.alert('Success', 'LLM downloaded successfully.', [
          { text: 'OK', onPress: () => { reset(); onClose(); } },
        ]);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [progress, visible, onClose]);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={() => { reset(); onClose(); }}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <IconWrapper icon={Download} size={spacings.xl} color={colors.text} />
            <Text style={styles.title}>Download LLM Locally</Text>
          </View>
          <Text style={styles.subtitle}>This is a mock download with pause/continue and cancel.</Text>

          <ProgressBar progress={progress} height={10} label="Downloading" showPercentage />

          <View style={styles.actionsRow}>
            <Button
              title={isPaused ? 'Continue' : 'Pause'}
              onPress={() => setIsPaused((v) => !v)}
              variant={isPaused ? 'success' : 'secondary'}
              size="medium"
              style={styles.action}
              icon={<IconWrapper icon={isPaused ? Play : Pause} size={18} color={colors.textInverse} />}
            />
            <Button
              title="Cancel"
              onPress={() => { reset(); onClose(); }}
              variant="outline"
              size="medium"
              style={[styles.action, styles.outlineOverride]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacings.screenPadding,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.card,
    borderRadius: spacings.borderRadius.md,
    padding: spacings.cardPadding,
    borderWidth: 1,
    borderColor: colors.border,
    ...spacings.shadow,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacings.md,
  },
  title: {
    marginLeft: spacings.md,
    fontSize: spacings.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  subtitle: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacings.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: spacings.lg,
  },
  action: {
    flex: 1,
    marginRight: spacings.md,
  },
  outlineOverride: {
    borderColor: colors.border,
  },
});
