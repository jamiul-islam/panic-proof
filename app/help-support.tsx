import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { HelpCircle, Mail, MessageCircle, Globe, ChevronRight, Phone, FileText } from 'lucide-react-native';
import IconWrapper from '@/components/IconWrapper';

export default function HelpSupportScreen() {
  const handleContactSupport = () => {
    Linking.openURL('mailto:support@disasterready.app');
  };
  
  const handleVisitWebsite = () => {
    Linking.openURL('https://disasterready.app');
  };
  
  const handleCallHotline = () => {
    Linking.openURL('tel:+18001234567');
  };
  
  return (
    <>
      <Stack.Screen options={{ title: "Help & Support" }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <IconWrapper icon={HelpCircle} size={32} color={colors.primary} />
            </View>
            <Text style={styles.headerTitle}>How can we help?</Text>
            <Text style={styles.headerDescription}>
              Find answers to common questions or contact our support team for assistance.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={handleContactSupport}
            >
              <View style={styles.contactItemLeft}>
                <View style={styles.contactIconContainer}>
                  <IconWrapper icon={Mail} size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.contactTitle}>Email Support</Text>
                  <Text style={styles.contactDescription}>
                    support@disasterready.app
                  </Text>
                </View>
              </View>
              <IconWrapper icon={ChevronRight} size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={handleCallHotline}
            >
              <View style={styles.contactItemLeft}>
                <View style={styles.contactIconContainer}>
                  <IconWrapper icon={Phone} size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.contactTitle}>Support Hotline</Text>
                  <Text style={styles.contactDescription}>
                    +1 (800) 123-4567
                  </Text>
                </View>
              </View>
              <IconWrapper icon={ChevronRight} size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={handleVisitWebsite}
            >
              <View style={styles.contactItemLeft}>
                <View style={styles.contactIconContainer}>
                  <IconWrapper icon={Globe} size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.contactTitle}>Website</Text>
                  <Text style={styles.contactDescription}>
                    disasterready.app
                  </Text>
                </View>
              </View>
              <IconWrapper icon={ChevronRight} size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Help Center</Text>
            
            <TouchableOpacity style={styles.helpItem}>
              <View style={styles.helpItemLeft}>
                <IconWrapper icon={FileText} size={20} color={colors.text} />
                <Text style={styles.helpItemText}>Frequently Asked Questions</Text>
              </View>
              <IconWrapper icon={ChevronRight} size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.helpItem}>
              <View style={styles.helpItemLeft}>
                <IconWrapper icon={MessageCircle} size={20} color={colors.text} />
                <Text style={styles.helpItemText}>Community Forum</Text>
              </View>
              <IconWrapper icon={ChevronRight} size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.helpItem}>
              <View style={styles.helpItemLeft}>
                <IconWrapper icon={FileText} size={20} color={colors.text} />
                <Text style={styles.helpItemText}>User Guide</Text>
              </View>
              <IconWrapper icon={ChevronRight} size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.helpItem}>
              <View style={styles.helpItemLeft}>
                <IconWrapper icon={FileText} size={20} color={colors.text} />
                <Text style={styles.helpItemText}>Troubleshooting</Text>
              </View>
              <IconWrapper icon={ChevronRight} size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackTitle}>We Value Your Feedback</Text>
            <Text style={styles.feedbackText}>
              Your feedback helps us improve the app. Let us know what you think or report any issues you encounter.
            </Text>
            <TouchableOpacity style={styles.feedbackButton}>
              <Text style={styles.feedbackButtonText}>Send Feedback</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '90%',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  helpItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  feedbackSection: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  feedbackButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  feedbackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});