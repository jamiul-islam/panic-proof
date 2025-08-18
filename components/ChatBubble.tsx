import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatMessage } from '@/types';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';

interface ChatBubbleProps {
  message: ChatMessage;
  formatTime: (timestamp: string) => string;
}

export default function ChatBubble({ message, formatTime }: ChatBubbleProps) {
  return (
    <View
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userMessageBubble : styles.aiMessageBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isUser ? styles.userMessageText : styles.aiMessageText,
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            message.isUser ? styles.userMessageTime : styles.aiMessageTime,
          ]}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    paddingHorizontal: spacings.screenPadding,
    marginBottom: spacings.md,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: spacings.lg,
    paddingVertical: spacings.md,
    borderRadius: spacings.borderRadius.xl,
  },
  userMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 6,
  },
  aiMessageBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 6,
    ...spacings.lightShadow,
  },
  messageText: {
    fontSize: spacings.fontSize.md,
    lineHeight: 22,
  },
  userMessageText: {
    color: colors.textInverse,
  },
  aiMessageText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: spacings.fontSize.xs - 1,
    marginTop: spacings.xs,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  aiMessageTime: {
    color: colors.textTertiary,
  },
});
