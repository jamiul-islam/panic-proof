import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { Lock, Eye, MapPin, Database, Shield, ChevronRight } from 'lucide-react-native';
import IconWrapper from '@/components/IconWrapper';

export default function PrivacySecurityScreen() {
  const [locationTracking, setLocationTracking] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);
  const [biometricLogin, setBiometricLogin] = useState(false);
  const [appLock, setAppLock] = useState(false);
  
  return (
    <>
      <Stack.Screen options={{ title: "Privacy & Security" }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy Settings</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <View style={styles.iconContainer}>
                  <IconWrapper icon={MapPin} size={20} color={colors.text} />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Location Tracking</Text>
                  <Text style={styles.settingDescription}>
                    Allow the app to track your location for alerts
                  </Text>
                </View>
              </View>
              <Switch
                value={locationTracking}
                onValueChange={setLocationTracking}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <View style={styles.iconContainer}>
                  <IconWrapper icon={Database} size={20} color={colors.text} />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Data Collection</Text>
                  <Text style={styles.settingDescription}>
                    Allow anonymous usage data collection
                  </Text>
                </View>
              </View>
              <Switch
                value={dataCollection}
                onValueChange={setDataCollection}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security Settings</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <View style={styles.iconContainer}>
                  <IconWrapper icon={Shield} size={20} color={colors.text} />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Biometric Login</Text>
                  <Text style={styles.settingDescription}>
                    Use Face ID or Touch ID to log in
                  </Text>
                </View>
              </View>
              <Switch
                value={biometricLogin}
                onValueChange={setBiometricLogin}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <View style={styles.iconContainer}>
                  <IconWrapper icon={Lock} size={20} color={colors.text} />
                </View>
                <View>
                  <Text style={styles.settingTitle}>App Lock</Text>
                  <Text style={styles.settingDescription}>
                    Require authentication when opening the app
                  </Text>
                </View>
              </View>
              <Switch
                value={appLock}
                onValueChange={setAppLock}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy Information</Text>
            
            <TouchableOpacity style={styles.linkItem}>
              <View style={styles.linkItemLeft}>
                <View style={styles.iconContainer}>
                  <IconWrapper icon={Eye} size={20} color={colors.text} />
                </View>
                <Text style={styles.linkTitle}>Privacy Policy</Text>
              </View>
              <IconWrapper icon={ChevronRight} size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.linkItem}>
              <View style={styles.linkItemLeft}>
                <View style={styles.iconContainer}>
                  <IconWrapper icon={Lock} size={20} color={colors.text} />
                </View>
                <Text style={styles.linkTitle}>Terms of Service</Text>
              </View>
              <IconWrapper icon={ChevronRight} size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.linkItem}>
              <View style={styles.linkItemLeft}>
                <View style={styles.iconContainer}>
                  <IconWrapper icon={Database} size={20} color={colors.text} />
                </View>
                <Text style={styles.linkTitle}>Data Usage</Text>
              </View>
              <IconWrapper icon={ChevronRight} size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>About Your Data</Text>
            <Text style={styles.infoText}>
              Disaster Ready takes your privacy seriously. We only collect data that is necessary to provide you with the best possible service. Your personal information is stored securely and is never shared with third parties without your consent.
            </Text>
            <Text style={styles.infoText}>
              Location data is only used to provide you with relevant alerts and is not stored on our servers unless you explicitly save a location.
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingItemLeft: {
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
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  linkItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkTitle: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  infoSection: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
});