// app/(tabs)/chat.tsx - Updated for Supabase integration
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Animated,
  Alert,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import { useSupabaseChatStore } from '@/store/supabase-chat-store';
import ChatMessagesList from '@/components/ChatMessagesList';

export default function ChatScreen() {
  const {
    currentSession,
    isTyping,
    isLoading,
    error,
    loadSessions,
    createNewSession,
    sendMessage,
  } = useSupabaseChatStore();

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const dot1Anim = useRef(new Animated.Value(0.4)).current;
  const dot2Anim = useRef(new Animated.Value(0.6)).current;
  const dot3Anim = useRef(new Animated.Value(0.8)).current;

  // Load sessions on mount
  useEffect(() => {
    console.log('🚀 ChatScreen mounted, loading sessions...');
    loadSessions();
  }, []);

  // Animate typing dots
  useEffect(() => {
    if (isTyping) {
      const animateDots = () => {
        const createDotAnimation = (animValue: Animated.Value, delay: number) => {
          return Animated.sequence([
            Animated.delay(delay),
            Animated.timing(animValue, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0.4,
              duration: 600,
              useNativeDriver: true,
            }),
          ]);
        };

        Animated.parallel([
          createDotAnimation(dot1Anim, 0),
          createDotAnimation(dot2Anim, 200),
          createDotAnimation(dot3Anim, 400),
        ]).start(() => {
          if (isTyping) animateDots();
        });
      };

      animateDots();
    } else {
      dot1Anim.stopAnimation();
      dot2Anim.stopAnimation();
      dot3Anim.stopAnimation();
    }
  }, [isTyping]);

  const handleSendMessage = async () => {
    if (inputText.trim() && !isTyping) {
      const messageText = inputText.trim();
      setInputText('');
      
      try {
        console.log('💬 Sending message:', messageText);
        await sendMessage(messageText);
      } catch (error) {
        console.error('❌ Failed to send message:', error);
        Alert.alert('Error', 'Failed to send message. Please try again.');
      }
    }
  };

  const handleNewChat = async () => {
    try {
      console.log('📝 Creating new chat...');
      await createNewSession();
    } catch (error) {
      console.error('❌ Failed to create new chat:', error);
      Alert.alert('Error', 'Failed to create new chat. Please try again.');
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={styles.typingContainer}>
        <View style={styles.typingBubble}>
          <View style={styles.typingDots}>
            <Animated.View style={[styles.dot, { opacity: dot1Anim }]} />
            <Animated.View style={[styles.dot, { opacity: dot2Anim }]} />
            <Animated.View style={[styles.dot, { opacity: dot3Anim }]} />
          </View>
        </View>
      </View>
    );
  };

  // Show error if there's a persistent error
  if (error && !currentSession) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={48} color={colors.danger} />
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadSessions}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show empty state when no session
  if (!currentSession && !isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <View style={styles.emptyChatContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={80} color={colors.textTertiary} />
          <Text style={styles.emptyChatTitle}>AI Emergency Assistant</Text>
          <Text style={styles.emptyChatSubtitle}>
            Get personalized emergency preparedness checklists! Ask me about any disaster preparation and I'll create actionable checklists you can save to your prep list.
          </Text>
          <TouchableOpacity 
            style={styles.newChatButton} 
            onPress={handleNewChat}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.textInverse} size="small" />
            ) : (
              <Ionicons name="add" size={24} color={colors.textInverse} />
            )}
            <Text style={styles.newChatButtonText}>
              {isLoading ? 'Creating...' : 'Start New Chat'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.chatTitle} numberOfLines={1}>
              {currentSession?.title || 'AI Chat'}
            </Text>
            <Text style={styles.chatSubtitle}>
              Emergency Preparedness Assistant
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={handleNewChat}
              disabled={isLoading}
            >
              <Ionicons 
                name="add" 
                size={24} 
                color={isLoading ? colors.textTertiary : colors.text} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages List */}
        {currentSession && (
          <ChatMessagesList
            sessionId={currentSession.id}
            flatListRef={flatListRef}
            formatTime={formatTime}
            renderTypingIndicator={renderTypingIndicator}
          />
        )}

        {/* Show error banner if there's an error but we have a session */}
        {error && currentSession && (
          <View style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={16} color={colors.danger} />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask about emergency preparedness..."
              placeholderTextColor={colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              editable={!isTyping && !!currentSession}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim() && !isTyping 
                  ? styles.sendButtonActive 
                  : styles.sendButtonInactive,
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isTyping || !currentSession}
            >
              <Ionicons
                name={isTyping ? "hourglass-outline" : "send"}
                size={20}
                color={
                  inputText.trim() && !isTyping 
                    ? colors.textInverse 
                    : colors.textTertiary
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  // Empty state styles
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacings.xxxxl,
  },
  emptyChatTitle: {
    fontSize: spacings.fontSize.xxl,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacings.sm,
    textAlign: 'center',
    marginTop: spacings.lg,
  },
  emptyChatSubtitle: {
    fontSize: spacings.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacings.xxxl,
    lineHeight: spacings.sectionSpacing,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacings.xxl,
    paddingVertical: spacings.md,
    borderRadius: 25,
    gap: spacings.sm,
  },
  newChatButtonText: {
    color: colors.textInverse,
    fontSize: spacings.fontSize.md,
    fontWeight: '600',
  },
  // Error state styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacings.xxxxl,
  },
  errorTitle: {
    fontSize: spacings.fontSize.xl,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacings.md,
    marginBottom: spacings.sm,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: spacings.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacings.xl,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacings.xl,
    paddingVertical: spacings.md,
    borderRadius: spacings.borderRadius.md,
  },
  retryButtonText: {
    color: colors.textInverse,
    fontSize: spacings.fontSize.md,
    fontWeight: '600',
  },
  // Error banner styles
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerBackground,
    paddingHorizontal: spacings.screenPadding,
    paddingVertical: spacings.sm,
    gap: spacings.sm,
  },
  errorBannerText: {
    fontSize: spacings.fontSize.sm,
    color: colors.danger,
    flex: 1,
  },
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacings.screenPadding,
    paddingVertical: spacings.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  chatTitle: {
    fontSize: spacings.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  chatSubtitle: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacings.sm,
  },
  headerButton: {
    padding: spacings.sm,
  },
  // Typing indicator styles
  typingContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  typingBubble: {
    backgroundColor: colors.card,
    paddingHorizontal: spacings.screenPadding,
    paddingVertical: spacings.md,
    borderRadius: spacings.borderRadius.lg,
    borderBottomLeftRadius: spacings.borderRadius.xs + 2,
    ...spacings.lightShadow,
  },
  typingDots: {
    flexDirection: 'row',
    gap: spacings.xs,
  },
  dot: {
    width: spacings.xs,
    height: spacings.xs,
    borderRadius: spacings.xs / 2,
    backgroundColor: colors.textTertiary,
  },
  // Input styles
  inputContainer: {
    backgroundColor: colors.card,
    paddingHorizontal: spacings.screenPadding,
    paddingTop: spacings.md,
    paddingBottom: spacings.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: spacings.borderRadius.full / 2,
    paddingHorizontal: spacings.screenPadding,
    paddingVertical: spacings.xs,
    gap: spacings.md,
  },
  textInput: {
    flex: 1,
    fontSize: spacings.fontSize.md,
    color: colors.text,
    maxHeight: spacings.xxxxl + spacings.xxxxl + spacings.xl,
    paddingVertical: spacings.xs,
  },
  sendButton: {
    width: spacings.xxxl + spacings.xs,
    height: spacings.xxxl + spacings.xs,
    borderRadius: spacings.fontSize.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
  sendButtonInactive: {
    backgroundColor: 'transparent',
  },
});
