import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { Shield, Smartphone, Mail } from 'lucide-react-native';
import IconWrapper from '@/components/IconWrapper';

export default function TwoFactorAuthScreen() {
  const { user } = useAuth();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isEmailEnabled, setIsEmailEnabled] = useState(false);
  const [isPhoneEnabled, setIsPhoneEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // In a real app, you would fetch the user's 2FA settings
    // For now, we'll just use dummy data
    setIs2FAEnabled(false);
    setIsEmailEnabled(false);
    setIsPhoneEnabled(false);
  }, []);
  
  const handle2FAToggle = (value: boolean) => {
    if (value) {
      // Enable 2FA
      Alert.alert(
        "Enable 2FA",
        "This would start the 2FA setup process in a real app.",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setIs2FAEnabled(false)
          },
          {
            text: "Setup",
            onPress: () => {
              setIsLoading(true);
              // Simulate API call
              setTimeout(() => {
                setIsLoading(false);
                setIs2FAEnabled(true);
                Alert.alert("2FA Enabled", "Two-factor authentication has been enabled for your account.");
              }, 1500);
            }
          }
        ]
      );
    } else {
      // Disable 2FA
      Alert.alert(
        "Disable 2FA",
        "Are you sure you want to disable two-factor authentication? This will make your account less secure.",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setIs2FAEnabled(true)
          },
          {
            text: "Disable",
            style: "destructive",
            onPress: () => {
              setIsLoading(true);
              // Simulate API call
              setTimeout(() => {
                setIsLoading(false);
                setIs2FAEnabled(false);
                setIsEmailEnabled(false);
                setIsPhoneEnabled(false);
                Alert.alert("2FA Disabled", "Two-factor authentication has been disabled for your account.");
              }, 1500);
            }
          }
        ]
      );
    }
  };
  
  const handleEmailToggle = (value: boolean) => {
    if (!is2FAEnabled) {
      Alert.alert("Enable 2FA First", "You need to enable two-factor authentication first.");
      return;
    }
    
    setIsEmailEnabled(value);
    
    if (value) {
      Alert.alert("Email 2FA Enabled", "You will now receive verification codes via email.");
    }
  };
  
  const handlePhoneToggle = (value: boolean) => {
    if (!is2FAEnabled) {
      Alert.alert("Enable 2FA First", "You need to enable two-factor authentication first.");
      return;
    }
    
    if (value && !user?.phoneNumbers?.length) {
      Alert.alert(
        "Phone Number Required",
        "You need to add a phone number to your account first.",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setIsPhoneEnabled(false)
          },
          {
            text: "Add Phone",
            onPress: () => {
              // In a real app, this would navigate to a screen to add a phone number
              Alert.alert("Add Phone", "This would navigate to a screen to add a phone number in a real app.");
              setIsPhoneEnabled(false);
            }
          }
        ]
      );
      return;
    }
    
    setIsPhoneEnabled(value);
    
    if (value) {
      Alert.alert("Phone 2FA Enabled", "You will now receive verification codes via SMS.");
    }
  };
  
  return (
    <>
      <Stack.Screen options={{ title: "Two-Factor Authentication" }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <IconWrapper icon={Shield} size={32} color={colors.primary} />
            </View>
            <Text style={styles.headerTitle}>Two-Factor Authentication</Text>
            <Text style={styles.headerDescription}>
              Add an extra layer of security to your account by requiring a verification code in addition to your password when you sign in.
            </Text>
          </View>
          
          <View style={styles.section}>
            <View style={styles.switchItem}>
              <View style={styles.switchItemLeft}>
                <Text style={styles.switchItemTitle}>Enable Two-Factor Authentication</Text>
                <Text style={styles.switchItemDescription}>
                  Require a verification code when signing in
                </Text>
              </View>
              <Switch
                value={is2FAEnabled}
                onValueChange={handle2FAToggle}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#fff"
                disabled={isLoading}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Verification Methods</Text>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemLeft}>
                <View style={styles.methodIconContainer}>
                  <IconWrapper icon={Mail} size={20} color={is2FAEnabled ? colors.text : '#9CA3AF'} />
                </View>
                <View>
                  <Text style={[styles.switchItemTitle, !is2FAEnabled && styles.disabledText]}>
                    Email
                  </Text>
                  <Text style={[styles.switchItemDescription, !is2FAEnabled && styles.disabledText]}>
                    Receive verification codes via email
                  </Text>
                </View>
              </View>
              <Switch
                value={isEmailEnabled}
                onValueChange={handleEmailToggle}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#fff"
                disabled={!is2FAEnabled || isLoading}
              />
            </View>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemLeft}>
                <View style={styles.methodIconContainer}>
                  <IconWrapper icon={Smartphone} size={20} color={is2FAEnabled ? colors.text : '#9CA3AF'} />
                </View>
                <View>
                  <Text style={[styles.switchItemTitle, !is2FAEnabled && styles.disabledText]}>
                    SMS
                  </Text>
                  <Text style={[styles.switchItemDescription, !is2FAEnabled && styles.disabledText]}>
                    Receive verification codes via SMS
                  </Text>
                </View>
              </View>
              <Switch
                value={isPhoneEnabled}
                onValueChange={handlePhoneToggle}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#fff"
                disabled={!is2FAEnabled || isLoading}
              />
            </View>
          </View>
          
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Why use two-factor authentication?</Text>
            <Text style={styles.infoText}>
              Two-factor authentication adds an extra layer of security to your account. Even if someone knows your password, they won't be able to access your account without the verification code.
            </Text>
            <Text style={styles.infoText}>
              We recommend enabling two-factor authentication for all accounts, especially those containing sensitive information.
            </Text>
          </View>
          
          {is2FAEnabled && (
            <Button
              title="Generate Backup Codes"
              onPress={() => Alert.alert("Backup Codes", "This would generate backup codes in a real app.")}
              variant="outline"
              style={styles.backupButton}
            />
          )}
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  switchItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  methodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  switchItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  switchItemDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  infoSection: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  backupButton: {
    marginBottom: 24,
  },
});