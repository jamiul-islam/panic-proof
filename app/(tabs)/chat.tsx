import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Plus, MoreHorizontal } from 'lucide-react-native';
import { useChatStore } from '@/store/chat-store';
import { ChatMessage } from '@/types';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import IconWrapper from '@/components/IconWrapper';
import ChatBubble from '@/components/ChatBubble';

export default function ChatScreen() {
  const {
    currentSession,
    isTyping,
    loadSessions,
    createNewSession,
    sendMessage,
  } = useChatStore();

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const dot1Anim = useRef(new Animated.Value(0.4)).current;
  const dot2Anim = useRef(new Animated.Value(0.6)).current;
  const dot3Anim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (currentSession?.messages.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentSession?.messages.length, isTyping]);

  useEffect(() => {
    if (isTyping) {
      const animateDots = () => {
        const createDotAnimation = (animValue: Animated.Value, delay: number) => {
          return Animated.loop(
            Animated.sequence([
              Animated.timing(animValue, {
                toValue: 1,
                duration: 600,
                delay,
                useNativeDriver: true,
              }),
              Animated.timing(animValue, {
                toValue: 0.4,
                duration: 600,
                useNativeDriver: true,
              }),
            ])
          );
        };

        Animated.parallel([
          createDotAnimation(dot1Anim, 0),
          createDotAnimation(dot2Anim, 200),
          createDotAnimation(dot3Anim, 400),
        ]).start();
      };

      animateDots();
    } else {
      dot1Anim.stopAnimation();
      dot2Anim.stopAnimation();
      dot3Anim.stopAnimation();
    }
  }, [isTyping]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleNewChat = () => {
    createNewSession();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    return <ChatBubble message={item} formatTime={formatTime} />;
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

  if (!currentSession) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <View style={styles.emptyChatContainer}>
          <Text style={styles.emptyChatTitle}>Welcome to AI Chat</Text>
          <Text style={styles.emptyChatSubtitle}>
            Start a conversation with your emergency preparedness assistant
          </Text>
          <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
            <IconWrapper icon={Plus} size={20} color={colors.textInverse} />
            <Text style={styles.newChatButtonText}>Start New Chat</Text>
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
              {currentSession.title}
            </Text>
            <Text style={styles.chatSubtitle}>AI Assistant</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleNewChat} style={styles.headerButton}>
              <IconWrapper icon={Plus} size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <IconWrapper icon={MoreHorizontal} size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={currentSession.messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderTypingIndicator}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about emergency preparedness..."
              placeholderTextColor={colors.textTertiary}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive,
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <IconWrapper
                icon={Send}
                size={18}
                color={inputText.trim() ? colors.textInverse : colors.textTertiary}
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
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: 16,
  },
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
