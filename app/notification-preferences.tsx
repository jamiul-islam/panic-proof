import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { Bell, AlertTriangle, ListChecks, Info, MapPin } from 'lucide-react-native';
import IconWrapper from '@/components/IconWrapper';

export default function NotificationPreferencesScreen() {
  const [alertNotifications, setAlertNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [weatherUpdates, setWeatherUpdates] = useState(true);
  const [newsUpdates, setNewsUpdates] = useState(false);
  const [locationAlerts, setLocationAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  
  return (
    <>
      <Stack.Screen options={{ title: "Notification Preferences" }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Types</Text>
            
            <View style={styles.notificationItem}>
              <View style={styles.notificationItemLeft}>
                <View style={styles.iconContainer}>
                  <IconWrapper icon={AlertTriangle} size={20} color={colors.danger} />
                </View>
                <View>
                  <Text style={styles.notificationTitle}>Emergency Alerts</Text>
                  <Text style={styles.notificationDescription}>
                    Critical alerts about disasters in your area
                  </Text>
                </View>
              </View>
              <Switch
                value={alertNotifications}
                onValueChange={setAlertNotifications}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.notificationItem}>
              <View style={styles.notificationItemLeft}>
                <View style={styles.iconContainer}>
                  <IconWrapper icon={ListChecks} size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.notificationTitle}>Task Reminders</Text>
                  <Text style={styles.notificationDescription}>
                    Reminders to complete preparedness tasks
                  </Text>
                </View>
              </View>
              <Switch
                value={taskReminders}
                onValueChange={setTaskReminders}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.notificationItem}>
              <View style={styles.notificationItemLeft}>
                <View style={styles.iconContainer}>
                  <IconWrapper icon={Info} size={20} color={colors.info} />
                </View>
                <View>
                  <Text style={styles.notificationTitle}>Weather Updates</Text>
                  <Text style={styles.notificationDescription}>
                    Updates about severe weather conditions
                  </Text>
                </View>
              </View>
              <Switch
                value={weatherUpdates}
                onValueChange={setWeatherUpdates}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.notificationItem}>
              <View style={styles.notificationItemLeft}>
                <View style={styles.iconContainer}>
                  <IconWrapper icon={Bell} size={20} color={colors.secondary} />
                </View>
                <View>
                  <Text style={styles.notificationTitle}>News Updates</Text>
                  <Text style={styles.notificationDescription}>
                    General news and updates about the app
                  </Text>
                </View>
              </View>
              <Switch
                value={newsUpdates}
                onValueChange={setNewsUpdates}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.notificationItem}>
              <View style={styles.notificationItemLeft}>
                <View style={styles.iconContainer}>
                  <IconWrapper icon={MapPin} size={20} color={colors.success} />
                </View>
                <View>
                  <Text style={styles.notificationTitle}>Location-based Alerts</Text>
                  <Text style={styles.notificationDescription}>
                    Alerts specific to your saved locations
                  </Text>
                </View>
              </View>
              <Switch
                value={locationAlerts}
                onValueChange={setLocationAlerts}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Channels</Text>
            
            <View style={styles.channelItem}>
              <View>
                <Text style={styles.channelTitle}>Push Notifications</Text>
                <Text style={styles.channelDescription}>
                  Receive notifications on your device
                </Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.channelItem}>
              <View>
                <Text style={styles.channelTitle}>Email Notifications</Text>
                <Text style={styles.channelDescription}>
                  Receive notifications via email
                </Text>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
          
          <View style={styles.infoSection}>
            <Text style={styles.infoText}>
              Emergency alerts cannot be disabled as they are critical for your safety.
            </Text>
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
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  notificationItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  channelTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  channelDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoSection: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});