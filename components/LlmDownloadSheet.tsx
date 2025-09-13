import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { Download, Pause, Play, Trash2, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import ProgressBar from '@/components/ProgressBar';
import Button from '@/components/Button';
import IconWrapper from '@/components/IconWrapper';

interface LlmDownloadSheetProps {
  visible: boolean;
  onClose: () => void;
}

type Status = 'idle' | 'downloading' | 'ready';

export default function LlmDownloadSheet({ visible, onClose }: LlmDownloadSheetProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState<'online' | 'offline'>('offline');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = () => {
    clearTimer();
    setStatus('idle');
    setProgress(0);
    setIsPaused(false);
  };

  useEffect(() => {
    if (visible && status === 'downloading' && !isPaused && progress < 100) {
      clearTimer();
      intervalRef.current = setInterval(() => {
        setProgress((p) => Math.min(p + 2, 100));
      }, 120);
    } else {
      clearTimer();
    }
    return () => clearTimer();
  }, [visible, status, isPaused, progress]);

  useEffect(() => {
    if (!visible) return;
    if (status === 'downloading' && progress >= 100) {
      clearTimer();
      const t = setTimeout(() => {
        setStatus('ready');
      }, 250);
      return () => clearTimeout(t);
    }
  }, [progress, status, visible]);

  const startDownload = () => {
    setStatus('downloading');
    setProgress(0);
    setIsPaused(false);
  };

  const handleDeleteModel = () => {
    // Remove local model (mock) and reset state
    reset();
  };

  const renderTopContent = () => {
    if (status !== 'ready') {
      return (
        <Text style={styles.topText}>No local LLM downloaded yet</Text>
      );
    }

    return (
      <View style={styles.modelCard}>
        <View style={styles.modelLeft}>
          <View style={styles.modelBadge}>
            <Text style={styles.modelBadgeText}>LLM</Text>
          </View>
          <Text style={styles.modelName}>llama-3.5</Text>
        </View>
        <TouchableOpacity onPress={handleDeleteModel} style={styles.trashButton}>
          <IconWrapper icon={Trash2} size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderMiddleContent = () => {
    if (status === 'downloading') {
      return (
        <View style={styles.progressWrap}>
          <View style={styles.progressHeader}>
            <IconWrapper icon={Download} size={spacings.xl} color={colors.text} />
            <Text style={styles.progressTitle}>Downloading model...</Text>
          </View>
          <ProgressBar progress={progress} height={10} label="Progress" showPercentage />
        </View>
      );
    }
    return <View style={styles.placeholder} />;
  };

  const renderBottomActions = () => {
    if (status === 'idle') {
      return (
        <Button
          title="Download LLM"
          onPress={startDownload}
          variant="primary"
          size="large"
        />
      );
    }
    if (status === 'downloading') {
      return (
        <View style={styles.actionsRow}>
          <Button
            title={isPaused ? 'Continue' : 'Pause'}
            onPress={() => setIsPaused((v) => !v)}
            variant={isPaused ? 'primary' : 'secondary'}
            size="large"
            style={styles.action}
            icon={<IconWrapper icon={isPaused ? Play : Pause} size={18} color={colors.textInverse} />}
          />
          <Button
            title="Cancel"
            onPress={reset}
            variant="danger"
            size="large"
            style={styles.action}
          />
        </View>
      );
    }
    // ready
    return (
      <View style={styles.actionsRow}>
        <Button
          title="Online"
          onPress={() => setMode('online')}
          variant={mode === 'online' ? 'primary' : 'outline'}
          size="large"
          style={styles.action}
        />
        <Button
          title="Offline"
          onPress={() => setMode('offline')}
          variant={mode === 'offline' ? 'primary' : 'outline'}
          size="large"
          style={styles.action}
        />
      </View>
    );
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconWrapper icon={X} size={22} color={colors.textTertiary} />
          </TouchableOpacity>

          {renderTopContent()}
          {renderMiddleContent()}

          <View style={styles.bottomArea}>
            {renderBottomActions()}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: spacings.borderRadius.lg,
    borderTopRightRadius: spacings.borderRadius.lg,
    paddingHorizontal: spacings.screenPadding,
    paddingTop: spacings.lg,
    paddingBottom: spacings.xxxl,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.backgroundTertiary,
    marginBottom: spacings.md,
  },
  closeButton: {
    position: 'absolute',
    right: spacings.screenPadding,
    top: spacings.lg,
    padding: spacings.xs,
  },
  topText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: spacings.fontSize.md,
    marginTop: spacings.md,
    marginBottom: spacings.lg,
  },
  modelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: spacings.borderRadius.md,
    padding: spacings.cardPadding,
    borderWidth: 1,
    borderColor: colors.border,
    ...spacings.lightShadow,
    marginTop: spacings.md,
    marginBottom: spacings.lg,
  },
  modelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacings.md,
  },
  modelBadge: {
    backgroundColor: colors.primaryBadge,
    paddingHorizontal: spacings.md,
    paddingVertical: spacings.xs,
    borderRadius: spacings.borderRadius.sm,
  },
  modelBadgeText: {
    color: colors.primary,
    fontSize: spacings.fontSize.sm,
    fontWeight: '600',
  },
  modelName: {
    color: colors.text,
    fontSize: spacings.fontSize.md,
    fontWeight: '600',
  },
  trashButton: {
    padding: spacings.xs,
  },
  progressWrap: {
    marginBottom: spacings.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacings.md,
    marginBottom: spacings.md,
  },
  progressTitle: {
    fontSize: spacings.fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    height: spacings.xxxl, // keeps layout balanced when idle/ready
  },
  bottomArea: {
    marginTop: spacings.lg,
  },
  actionsRow: {
    flexDirection: 'row',
  },
  action: {
    flex: 1,
    marginRight: spacings.md,
  },
});
