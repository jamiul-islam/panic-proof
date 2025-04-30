import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { Mail, Key, AlertTriangle } from 'lucide-react-native';
import IconWrapper from '@/components/IconWrapper';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChangeEmail = () => {
    // In a real app, this would navigate to a change email screen
    Alert.alert(
      "Change Email",
      "This would navigate to a change email screen in a real app.",
      [{ text: "OK" }]
    );
  };
  
  const handleChangePassword = () => {
    // In a real app, this would navigate to a change password screen
    Alert.alert(
      "Change Password",
      "This would navigate to a change password screen in a real app.",
      [{ text: "OK" }]
    );
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setIsLoading(true);
            // In a real app, this would delete the user's account
            setTimeout(() => {
              setIsLoading(false);
              Alert.alert(
                "Account Deleted",
                "Your account has been deleted successfully.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      // Navigate to sign in
                      router.replace('/(auth)/sign-in');
                    }
                  }
                ]
              );
            }, 2000);
          }
        }
      ]
    );
  };
  
  return (
    <>
      <Stack.Screen options={{ title: "Account Settings" }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.primaryEmailAddress?.emailAddress || "Not set"}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{user?.fullName || "Not set"}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Account Created</Text>
              <Text style={styles.infoValue}>
                {user?.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString() 
                  : "Unknown"}
              </Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Security</Text>
            
            <TouchableOpacity 
              style={styles.securityItem} 
              onPress={handleChangeEmail}
            >
              <View style={styles.securityItemLeft}>
                <IconWrapper icon={Mail} size={20} color={colors.text} />
                <Text style={styles.securityItemText}>Change Email</Text>
              </View>
              <Text style={styles.securityItemAction}>Change</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.securityItem} 
              onPress={handleChangePassword}
            >
              <View style={styles.securityItemLeft}>
                <IconWrapper icon={Key} size={20} color={colors.text} />
                <Text style={styles.securityItemText}>Change Password</Text>
              </View>
              <Text style={styles.securityItemAction}>Change</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.dangerSection}>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
            <Text style={styles.dangerDescription}>
              Deleting your account will permanently remove all your data from our servers. This action cannot be undone.
            </Text>
            
            <Button
              title="Delete Account"
              onPress={handleDeleteAccount}
              variant="danger"
              isLoading={isLoading}
              icon={<IconWrapper icon={AlertTriangle} size={20} color="#fff" />}
              iconPosition="left"
              style={styles.deleteButton}
            />
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
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  securityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  securityItemAction: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  dangerSection: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.danger,
    marginBottom: 8,
  },
  dangerDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
});