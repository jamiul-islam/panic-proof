import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import { useAuthStore } from "@/store/auth-store";
import { useUserStore } from "@/store/user-store";
import { AuthFlowHelper } from "@/utils/auth-flow";
import { clearAllPersistedStores } from "@/utils/storage-reset";
import "@/utils/dev-helpers"; // Import dev helpers for development

export const unstable_settings = {
  initialRouteName: "(auth)/sign-in",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// This component handles the authentication and onboarding flow
function InitialLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { isSignedIn, userId } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { isAuthenticated, hasCompletedOnboarding, setAuthenticated, setOnboardingCompleted } = useAuthStore();
  const { profile, setProfile, loadUserProfile } = useUserStore();
  const [isCheckingUserProfile, setIsCheckingUserProfile] = useState(false);
  const [hasReset, setHasReset] = useState(false);
  
  // Clear storage on first load to fix migration issues
  useEffect(() => {
    const resetStorageOnce = async () => {
      if (!hasReset) {
        await clearAllPersistedStores();
        setHasReset(true);
        console.log('Storage cleared to fix migration issues');
      }
    };
    resetStorageOnce();
  }, [hasReset]);
  
  useEffect(() => {
    // Update auth store based on Clerk auth state
    setAuthenticated(!!isSignedIn);
  }, [isSignedIn, setAuthenticated]);

  // Check if user exists in Supabase when they authenticate (sign in)
  useEffect(() => {
    const checkUserProfile = async () => {
      // Only check if:
      // 1. User is signed in
      // 2. Clerk data is loaded  
      // 3. We have a userId
      // 4. We're not already checking
      // 5. We don't have a profile loaded
      // 6. Onboarding is marked as not completed (default state for sign-ins)
      if (!isSignedIn || !userLoaded || !userId || isCheckingUserProfile || profile || hasCompletedOnboarding || !hasReset) {
        return;
      }

      setIsCheckingUserProfile(true);

      try {
        // Check if user exists in Supabase database
        const supabaseUser = await AuthFlowHelper.getUserForProfile(userId);
        
        if (supabaseUser) {
          // User exists in Supabase = they completed onboarding during signup
          setOnboardingCompleted(true);
          // Load the user profile into the store
          await loadUserProfile(userId);
          console.log('User found in Supabase, onboarding completed');
        } else {
          // User doesn't exist in Supabase, they need onboarding
          setOnboardingCompleted(false);
          console.log('User not found in Supabase, needs onboarding');
        }
        // If user doesn't exist in Supabase, hasCompletedOnboarding stays false
        // and they'll be redirected to onboarding
      } catch (error) {
        console.error('Error checking user profile:', error);
        // If there's an error checking, keep hasCompletedOnboarding as false
        // This ensures they go through onboarding if there's any doubt
      } finally {
        setIsCheckingUserProfile(false);
      }
    };

    checkUserProfile();
  }, [isSignedIn, userLoaded, userId, isCheckingUserProfile, profile, hasCompletedOnboarding, setOnboardingCompleted, hasReset]);
  
  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "onboarding";
    
    // Wait for Clerk to load and user profile check to complete before navigation
    if (!userLoaded || isCheckingUserProfile) {
      return;
    }
    
    if (!isAuthenticated && !inAuthGroup) {
      // If not authenticated and not in auth group, redirect to sign-in
      router.replace("/(auth)/sign-in");
    } else if (isAuthenticated) {
      if (!hasCompletedOnboarding && !inOnboardingGroup) {
        // If authenticated but not onboarded, redirect to onboarding
        router.replace("/onboarding");
      } else if (hasCompletedOnboarding && (inAuthGroup || inOnboardingGroup)) {
        // If authenticated and onboarded but in auth or onboarding group, redirect to home
        router.replace("/(tabs)");
      }
    }
  }, [isAuthenticated, hasCompletedOnboarding, userLoaded, isCheckingUserProfile, segments, router]);
  
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="disasters" options={{ headerShown: true }} />
      <Stack.Screen name="alert-details/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="task-details/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="disaster-details/[type]" options={{ headerShown: true }} />
      <Stack.Screen name="emergency-contacts" options={{ headerShown: true }} />
      <Stack.Screen name="add-contact" options={{ headerShown: true }} />
      <Stack.Screen name="edit-contact/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="edit-profile" options={{ headerShown: true }} />
      <Stack.Screen name="saved-locations" options={{ headerShown: true }} />
      <Stack.Screen name="add-location" options={{ headerShown: true }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  
  const clerkPublishableKey = Constants.expoConfig?.extra?.clerkPublishableKey || "";

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ErrorBoundary>
        <InitialLayout />
      </ErrorBoundary>
    </ClerkProvider>
  );
}