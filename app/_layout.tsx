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

// Remove this - let Expo Router handle initial route based on auth state
// export const unstable_settings = {
//   initialRouteName: "(auth)/sign-in",
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// This component handles the authentication and onboarding flow
function InitialLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { isSignedIn, userId } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { isAuthenticated, hasCompletedOnboarding, setAuthenticated, setOnboardingCompleted, setUserData } = useAuthStore();
  const { profile, setProfile, loadUserProfile } = useUserStore();
  const [isCheckingUserProfile, setIsCheckingUserProfile] = useState(false);
  const [hasReset, setHasReset] = useState(false);
  
  // Only clear storage in development when needed - not on every launch
  useEffect(() => {
    const resetStorageOnce = async () => {
      // Only clear storage if there's a specific development need
      // Comment this out for normal operation
      if (__DEV__ && false) { // Set to true only when you need to reset
        await clearAllPersistedStores();
        console.log('Storage cleared for development reset');
      }
      setHasReset(true);
    };
    resetStorageOnce();
  }, []);
  
  useEffect(() => {
    // Update auth store based on Clerk auth state
    setAuthenticated(!!isSignedIn);
    
    // If user is signed in, also set their data
    if (isSignedIn && userId && user?.emailAddresses?.[0]?.emailAddress) {
      console.log('🔧 [Layout] Setting user data from Clerk:', {
        userId,
        email: user.emailAddresses[0].emailAddress
      });
      setUserData(userId, user.emailAddresses[0].emailAddress);
    }
  }, [isSignedIn, userId, user, setAuthenticated, setUserData]);

  // Check if user exists in Supabase when they authenticate (sign in)
  useEffect(() => {
    const checkUserProfile = async () => {
      // Only check if:
      // 1. User is signed in with Clerk
      // 2. Clerk data is loaded  
      // 3. We have a userId
      // 4. We're not already checking
      // 5. We don't have a profile loaded yet
      // 6. Storage reset is complete (for development)
      if (!isSignedIn || !userLoaded || !userId || isCheckingUserProfile || profile || !hasReset) {
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
    
    // Wait for all required data to be loaded before making navigation decisions
    if (!userLoaded || isCheckingUserProfile) {
      return;
    }
    
    console.log('Navigation check:', { 
      isAuthenticated, 
      hasCompletedOnboarding, 
      currentSegment: segments[0],
      isSignedIn 
    });
    
    if (!isAuthenticated && !inAuthGroup) {
      // Not authenticated and not in auth group - go to sign in
      console.log('Redirecting to sign-in: not authenticated');
      router.replace("/(auth)/sign-in");
    } else if (isAuthenticated) {
      if (!hasCompletedOnboarding && !inOnboardingGroup) {
        // Authenticated but needs onboarding
        console.log('Redirecting to onboarding: authenticated but not onboarded');
        router.replace("/onboarding");
      } else if (hasCompletedOnboarding && (inAuthGroup || inOnboardingGroup)) {
        // Authenticated and onboarded but in wrong group - go to home
        console.log('Redirecting to home: authenticated and onboarded');
        router.replace("/(tabs)");
      }
      // If authenticated and in the right place, do nothing (let user stay)
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