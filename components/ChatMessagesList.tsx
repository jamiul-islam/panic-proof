// components/ChatMessagesList.tsx - Component to load and display messages from Supabase
import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { supabase } from '../lib/supabase';
import ChatBubble from './ChatBubble';
import { ChatMessage } from '../types/chat';
import { colors } from '../constants/colors';
import { spacings } from '../constants/spacings';

interface ChatMessagesListProps {
  sessionId: string;
  flatListRef?: React.RefObject<FlatList>;
  formatTime: (timestamp: string) => string;
  renderTypingIndicator?: () => React.ReactNode;
}

export default function ChatMessagesList({ 
  sessionId, 
  flatListRef, 
  formatTime, 
  renderTypingIndicator 
}: ChatMessagesListProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = async () => {
    console.log('📥 Loading messages for session:', sessionId);
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: loadError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (loadError) {
        throw loadError;
      }

      console.log(`✅ Loaded ${data?.length || 0} messages`);
      
      // Transform database messages to ChatMessage format
      const transformedMessages = data?.map(msg => {
        const chatMessage: ChatMessage = {
          id: msg.id,
          content: msg.content,
          role: msg.role as 'user' | 'assistant',
          timestamp: msg.created_at || new Date().toISOString()
        };

        // Add checklist data if present
        if (msg.checklist_data && msg.role === 'assistant') {
          const checklistData = msg.checklist_data as any;
          chatMessage.checklistData = checklistData.checklist;
          chatMessage.itemsData = checklistData.items;
        }

        return chatMessage;
      }) || [];

      setMessages(transformedMessages);

    } catch (err) {
      console.error('❌ Failed to load messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      loadMessages();
    }
  }, [sessionId]);

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    return (
      <ChatBubble 
        message={item} 
        formatTime={formatTime}
        messageId={item.id} // Pass the database message ID
      />
    );
  };

  const onRefresh = () => {
    loadMessages();
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading messages</Text>
        <Text style={styles.errorDetail}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      renderItem={renderMessage}
      keyExtractor={(item) => item.id}
      style={styles.messagesList}
      contentContainerStyle={styles.messagesContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
      ListFooterComponent={renderTypingIndicator}
      onContentSizeChange={() => {
        // Auto-scroll to bottom when messages change
        setTimeout(() => {
          flatListRef?.current?.scrollToEnd({ animated: true });
        }, 100);
      }}
    />
  );
}

const styles = StyleSheet.create({
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacings.screenPadding,
  },
  errorText: {
    fontSize: spacings.fontSize.md,
    fontWeight: '600',
    color: colors.danger,
    marginBottom: spacings.sm,
    textAlign: 'center',
  },
  errorDetail: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
