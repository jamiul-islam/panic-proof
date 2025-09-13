import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { Download, Pause, Play, Trash2, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import ProgressBar from '@/components/ProgressBar';
import Button from '@/components/Button';
import IconWrapper from '@/components/IconWrapper';
import { useLlmStore } from '@/store/llm-store';

interface LlmDownloadSheetProps {
  visible: boolean;
  onClose: () => void;
}

type Status = 'idle' | 'downloading' | 'ready';

export default function LlmDownloadSheet({ visible, onClose }: LlmDownloadSheetProps) {
  const { modelStatus, progress, init, downloadModel, cancelDownload, deleteModel, provider, setProvider } = useLlmStore();
  const [status, setStatus] = useState<Status>('idle');
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
    setStatus('idle');
    setIsPaused(false);
  };

  useEffect(() => { if (visible) init(); }, [visible]);

  // Keep mock animation smooth; use store progress as source of truth when available
  const [visualProgress, setVisualProgress] = useState(0);

  useEffect(() => {
    if (modelStatus === 'not_installed') setStatus('idle');
    if (modelStatus === 'downloading') setStatus('downloading');
    if (modelStatus === 'ready') setStatus('ready');
  }, [modelStatus]);

  useEffect(() => {
    if (visible && status === 'downloading' && !isPaused && (visualProgress < 100)) {
      clearTimer();
      intervalRef.current = setInterval(() => {
        setVisualProgress((p) => Math.min(p + 2, 100));
      }, 120);
    } else {
      clearTimer();
    }
    return () => clearTimer();
  }, [visible, status, isPaused, visualProgress]);

  useEffect(() => {
    if (!visible) return;
    const shownProgress = Math.max(progress || 0, visualProgress);
    if (status === 'downloading' && shownProgress >= 100) {
      clearTimer();
      const t = setTimeout(() => {
        setStatus('ready');
      }, 250);
      return () => clearTimeout(t);
    }
  }, [progress, visualProgress, status, visible]);

  const startDownload = () => {
    setStatus('downloading');
    setIsPaused(false);
    setVisualProgress(0);
    // Download ExecuTorch example model (Llama 3.2 1B SpinQuant)
    downloadModel('https://huggingface.co/software-mansion/react-native-executorch-llama-3.2/resolve/main/llama-3.2-1B/spinquant/llama3_2_spinquant.pte', 'llama3_2_spinquant.pte', { version: '0.1.0' });
  };

  const handleDeleteModel = async () => {
    await deleteModel();
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
          <Text style={styles.modelName}>Llama 3.2 1B (SpinQuant)</Text>
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
          <ProgressBar progress={Math.max(progress || 0, visualProgress)} height={10} label="Progress" showPercentage />
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
            onPress={async () => { await cancelDownload(); reset(); }}
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
          onPress={() => setProvider('online')}
          variant={provider === 'online' ? 'primary' : 'outline'}
          size="large"
          style={styles.action}
        />
        <Button
          title="Offline"
          onPress={() => setProvider('local')}
          variant={provider === 'local' ? 'primary' : 'outline'}
          size="large"
          style={styles.action}
        />
      </View>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Offline AI Support</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconWrapper icon={X} size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {renderTopContent()}
          {renderMiddleContent()}
          <View style={styles.bottomArea}>{renderBottomActions()}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacings.screenPadding,
    paddingTop: spacings.xxl,
    paddingBottom: spacings.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSecondary,
    backgroundColor: colors.card,
  },
  title: {
    fontSize: spacings.fontSize.xl,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: spacings.xs,
  },
  content: {
    flex: 1,
    padding: spacings.screenPadding,
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
