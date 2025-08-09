import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import { useAuthStore } from "@/store/auth-store";
import { useUserStore } from "@/store/user-store";
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
  const { isSignedIn } = useAuth();
  const { isAuthenticated, hasCompletedOnboarding, setAuthenticated } = useAuthStore();
  const { profile } = useUserStore();
  
  useEffect(() => {
    // Update auth store based on Clerk auth state
    setAuthenticated(!!isSignedIn);
  }, [isSignedIn, setAuthenticated]);
  
  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "onboarding";
    
    console.log("Auth state:", { isAuthenticated, hasCompletedOnboarding, segments });
    
    if (!isAuthenticated && !inAuthGroup) {
      // If not authenticated and not in auth group, redirect to sign-in
      console.log("Redirecting to sign-in");
      router.replace("/(auth)/sign-in");
    } else if (isAuthenticated) {
      if (!hasCompletedOnboarding && !inOnboardingGroup) {
        // If authenticated but not onboarded, redirect to onboarding
        console.log("Redirecting to onboarding");
        router.replace("/onboarding");
      } else if (hasCompletedOnboarding && (inAuthGroup || inOnboardingGroup)) {
        // If authenticated and onboarded but in auth or onboarding group, redirect to home
        console.log("Redirecting to tabs");
        router.replace("/(tabs)");
      }
    }
  }, [isAuthenticated, hasCompletedOnboarding, segments, router]);
  
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
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