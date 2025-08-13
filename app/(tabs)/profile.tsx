import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/user-store';
import { useTasksStore } from '@/store/tasks-store';
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
  BookOpen
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import ProfileHeader from '@/components/ProfileHeader';
import IconWrapper from '@/components/IconWrapper';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useUserStore();
  const { fetchTasks } = useTasksStore();
  const { signOut } = useAuth();
  const { reset } = useAuthStore();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
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
    router.push('/(tabs)/resources');
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
              await signOut();
              reset();
              router.replace('/(auth)/sign-in');
            } catch (error) {
              console.error('Error signing out:', error);
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
      // In a real app, you would upload this image to a server
      // For now, we'll just update the local state
      if (profile) {
        updateProfile({
          ...profile,
          profileImage: result.assets[0].uri
        });
      }
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
              <IconWrapper icon={Camera} size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name || "User"}</Text>
            <View style={styles.locationContainer}>
              <IconWrapper icon={MapPin} size={14} color="#6B7280" />
              <Text style={styles.locationText}>{profile.location || "Set your location"}</Text>
            </View>
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={handleEditProfile}
            >
              <IconWrapper icon={Edit} size={14} color={colors.primary} />
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
              <IconWrapper icon={MapPin} size={20} color={colors.text} />
              <Text style={styles.menuItemText}>Saved Locations</Text>
            </View>
            <IconWrapper icon={ChevronRight} size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleEmergencyContacts}
          >
            <View style={styles.menuItemLeft}>
              <IconWrapper icon={Phone} size={20} color={colors.text} />
              <Text style={styles.menuItemText}>Emergency Contacts</Text>
            </View>
            <IconWrapper icon={ChevronRight} size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleResources}
          >
            <View style={styles.menuItemLeft}>
              <IconWrapper icon={BookOpen} size={20} color={colors.text} />
              <Text style={styles.menuItemText}>Resources</Text>
            </View>
            <IconWrapper icon={ChevronRight} size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <IconWrapper icon={LogOut} size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    paddingTop: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProfileText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});