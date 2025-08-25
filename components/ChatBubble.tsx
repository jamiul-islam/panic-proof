import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatMessage } from '@/types';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import { useSupabaseChatStore } from '@/store/supabase-chat-store';

interface ChatBubbleProps {
  message: ChatMessage;
  formatTime: (timestamp: string) => string;
  messageId?: string; // For database messages
}

export default function ChatBubble({ message, formatTime, messageId }: ChatBubbleProps) {
  const [isAddingToList, setIsAddingToList] = useState(false);
  const addChecklistToPrepList = useSupabaseChatStore(state => state.addChecklistToPrepList);
  
  // Check if this is an assistant message with checklist data
  const hasChecklist = message.role === 'assistant' && 
    (message.checklistData || (message.content && message.content.includes('checklist')));

  const handleAddToPrepList = async () => {
    if (!messageId) {
      Alert.alert('Error', 'Cannot save checklist - message ID not found');
      return;
    }

    setIsAddingToList(true);
    
    try {
      const success = await addChecklistToPrepList(messageId);
      
      if (success) {
        Alert.alert(
          'Success! 🎉', 
          'Checklist added to your Prepare section. You can find it under your checklists.',
          [{ text: 'Great!', style: 'default' }]
        );
      } else {
        Alert.alert('Error', 'Failed to add checklist to your prep list');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add checklist to your prep list');
    } finally {
      setIsAddingToList(false);
    }
  };

  const renderChecklistPreview = () => {
    if (!message.checklistData) return null;

    const { checklistData, itemsData } = message;

    return (
      <View style={styles.checklistPreview}>
        <View style={styles.checklistHeader}>
          <Ionicons name="list-outline" size={16} color={colors.primary} />
          <Text style={styles.checklistTitle}>{checklistData.title}</Text>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>{checklistData.points} pts</Text>
          </View>
        </View>
        
        <Text style={styles.checklistCategory}>
          📂 {checklistData.category.charAt(0).toUpperCase() + checklistData.category.slice(1)}
        </Text>
        
        <View style={styles.itemsPreview}>
          {itemsData.slice(0, 2).map((item, index) => (
            <View key={index} style={styles.previewItem}>
              <Text style={styles.priorityDot}>
                {item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '🟡' : '🟢'}
              </Text>
              <Text style={styles.itemText} numberOfLines={1}>
                {item.text}
              </Text>
            </View>
          ))}
          {itemsData.length > 2 && (
            <Text style={styles.moreItems}>
              +{itemsData.length - 2} more items...
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.messageContainer,
        message.role === 'user' ? styles.userMessageContainer : styles.aiMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.role === 'user' ? styles.userMessageBubble : styles.aiMessageBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.role === 'user' ? styles.userMessageText : styles.aiMessageText,
          ]}
        >
          {message.content}
        </Text>
        
        {/* Show checklist preview for AI messages */}
        {message.role === 'assistant' && renderChecklistPreview()}
        
        {/* Add to Prep List button for AI messages with checklists */}
        {hasChecklist && messageId && (
          <TouchableOpacity
            style={[
              styles.addToListButton,
              isAddingToList && styles.addToListButtonDisabled
            ]}
            onPress={handleAddToPrepList}
            disabled={isAddingToList}
          >
            <Ionicons 
              name={isAddingToList ? "hourglass-outline" : "add-circle-outline"} 
              size={16} 
              color={colors.primary} 
            />
            <Text style={styles.addToListButtonText}>
              {isAddingToList ? 'Adding...' : 'Add to Prep List'}
            </Text>
          </TouchableOpacity>
        )}
        
        <Text
          style={[
            styles.messageTime,
            message.role === 'user' ? styles.userMessageTime : styles.aiMessageTime,
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
  // New styles for checklist preview
  checklistPreview: {
    marginTop: spacings.md,
    padding: spacings.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: spacings.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  checklistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacings.xs,
  },
  checklistTitle: {
    fontSize: spacings.fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacings.xs,
    flex: 1,
  },
  pointsBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacings.xs,
    paddingVertical: 2,
    borderRadius: spacings.borderRadius.sm,
  },
  pointsText: {
    fontSize: spacings.fontSize.xs,
    color: colors.textInverse,
    fontWeight: '600',
  },
  checklistCategory: {
    fontSize: spacings.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacings.sm,
  },
  itemsPreview: {
    gap: spacings.xs,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    fontSize: 8,
    marginRight: spacings.xs,
  },
  itemText: {
    fontSize: spacings.fontSize.xs,
    color: colors.text,
    flex: 1,
  },
  moreItems: {
    fontSize: spacings.fontSize.xs,
    color: colors.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacings.xs,
  },
  addToListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacings.md,
    paddingVertical: spacings.sm,
    paddingHorizontal: spacings.md,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: spacings.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addToListButtonDisabled: {
    opacity: 0.6,
  },
  addToListButtonText: {
    fontSize: spacings.fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacings.xs,
  },
});
