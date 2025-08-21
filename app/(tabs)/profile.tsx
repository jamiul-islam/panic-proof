import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/user-store';
import { useTasksStore } from '@/store/tasks-store';
import { useAlertsStore } from '@/store/alerts-store';
import { useAuth } from '@clerk/clerk-expo';
import { useAuthStore } from '@/store/auth-store';
import * as ImagePicker from 'expo-image-picker';
import { 
  Phone, 
  LogOut,
  ChevronRight,
  MapPin,
  Camera,
  Edit,
  BookOpen,
  Lock
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import ProfileHeader from '@/components/ProfileHeader';
import IconWrapper from '@/components/IconWrapper';
import ChangePasswordModal from '@/components/ChangePasswordModal';

export default function ProfileScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const { profile, updateProfile, clearPersistedState: clearUserData, loadUserProfile } = useUserStore();
  const { fetchTasks, clearPersistedState: clearTasksData } = useTasksStore();
  const { clearPersistedState: clearAlertsData } = useAlertsStore();
  const { signOut: clerkSignOut } = useAuth();
  const { signOut: authStoreSignOut, clearPersistedState: clearAuthData } = useAuthStore();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  // Load user profile if not already loaded
  useEffect(() => {
    if (!profile && userId) {
      loadUserProfile(userId);
    }
  }, [profile, userId, loadUserProfile]);
  
  const handleEditProfile = () => {
    router.push('/edit-profile');
  };
  
  const handleEmergencyContacts = () => {
    router.push('/emergency-contacts');
  };
  
  const handleSavedLocations = () => {
    router.push('/saved-locations');
  };
  
  const handleResources = () => {
    router.push('/resources');
  };
  
  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };
  
  const handleChangePasswordSuccess = () => {
    // Password was successfully changed
    Alert.alert('Success', 'Your password has been successfully changed.');
  };
  
  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear local auth state first
              authStoreSignOut();
              
              // Clear all persisted data from all stores
              await clearUserData(); 
              await clearTasksData();
              await clearAlertsData();
              
              // Sign out from Clerk last
              await clerkSignOut();
              
              // Navigate to sign-in screen
              router.replace('/(auth)/sign-in');
            } catch (error) {
              // Silent error handling for sign out
            }
          }
        }
      ]
    );
  };
  
  const handlePickImage = async () => {
    // Request permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos to change your profile picture.");
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      // TODO: Add profile_image column to users table to persist this
      // For now, we'll just update the local state
      // if (profile && userId) {
      //   try {
      //     await updateProfile(userId, {
      //       profileImage: result.assets[0].uri
      //     });
      //   } catch (error) {
      //     console.error('Error updating profile image:', error);
      //   }
      // }
    }
  };
  
  if (!profile) return null;
  
  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {profileImage || profile.profileImage ? (
              <Image
                source={profileImage || profile.profileImage}
                style={styles.profileImage}
                contentFit="cover"
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImagePlaceholderText}>
                  {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                </Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={handlePickImage}
            >
              <IconWrapper icon={Camera} size={spacings.lg} color={colors.textInverse} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name || "User"}</Text>
            <View style={styles.locationContainer}>
              <IconWrapper icon={MapPin} size={spacings.fontSize.sm} color={colors.textSecondary} />
              <Text style={styles.locationText}>{profile.location || "Set your location"}</Text>
            </View>
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={handleEditProfile}
            >
              <IconWrapper icon={Edit} size={spacings.fontSize.sm} color={colors.primary} />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <ProfileHeader />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Preparedness</Text>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleSavedLocations}
          >
            <View style={styles.menuItemLeft}>
              <IconWrapper icon={MapPin} size={spacings.xl} color={colors.text} />
              <Text style={styles.menuItemText}>Saved Locations</Text>
            </View>
            <IconWrapper icon={ChevronRight} size={spacings.xl} color={colors.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleEmergencyContacts}
          >
            <View style={styles.menuItemLeft}>
              <IconWrapper icon={Phone} size={spacings.xl} color={colors.text} />
              <Text style={styles.menuItemText}>Emergency Contacts</Text>
            </View>
            <IconWrapper icon={ChevronRight} size={spacings.xl} color={colors.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleResources}
          >
            <View style={styles.menuItemLeft}>
              <IconWrapper icon={BookOpen} size={spacings.xl} color={colors.text} />
              <Text style={styles.menuItemText}>Resources</Text>
            </View>
            <IconWrapper icon={ChevronRight} size={spacings.xl} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleChangePassword}
          >
            <View style={styles.menuItemLeft}>
              <IconWrapper icon={Lock} size={spacings.xl} color={colors.text} />
              <Text style={styles.menuItemText}>Change Password</Text>
            </View>
            <IconWrapper icon={ChevronRight} size={spacings.xl} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <IconWrapper icon={LogOut} size={spacings.xl} color={colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
      
      <ChangePasswordModal
        visible={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSuccess={handleChangePasswordSuccess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacings.screenPadding,
    paddingTop: spacings.xl,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacings.lg,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: spacings.lg,
  },
  profileImage: {
    width: spacings.xxxxl + spacings.xxxxl,
    height: spacings.xxxxl + spacings.xxxxl,
    borderRadius: spacings.xxxxl,
    backgroundColor: colors.backgroundTertiary,
  },
  profileImagePlaceholder: {
    width: spacings.xxxxl + spacings.xxxxl,
    height: spacings.xxxxl + spacings.xxxxl,
    borderRadius: spacings.xxxxl,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    fontSize: spacings.fontSize.xxxl,
    fontWeight: '600',
    color: colors.textInverse,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: spacings.sectionSpacing + spacings.xs,
    height: spacings.sectionSpacing + spacings.xs,
    borderRadius: spacings.fontSize.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: spacings.fontSize.xl,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacings.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacings.xs,
  },
  locationText: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacings.xs,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProfileText: {
    fontSize: spacings.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: spacings.xs,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: spacings.borderRadius.md,
    padding: spacings.cardPadding,
    marginBottom: spacings.lg,
    ...spacings.lightShadow,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacings.md,
  },
  sectionTitle: {
    fontSize: spacings.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacings.lg,
  },
  seeAll: {
    fontSize: spacings.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacings.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSecondary,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: spacings.fontSize.md,
    color: colors.text,
    marginLeft: spacings.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerBackground,
    borderRadius: spacings.borderRadius.xs,
    padding: spacings.cardPadding,
    marginBottom: spacings.lg,
  },
  logoutText: {
    fontSize: spacings.fontSize.md,
    fontWeight: '600',
    color: colors.danger,
    marginLeft: spacings.xs,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: spacings.sectionSpacing,
  },
  versionText: {
    fontSize: spacings.fontSize.xs,
    color: colors.textTertiary,
  },
});