export default {
  expo: {
    name: "Panic Proof",
    slug: "panic-proof",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.panicproof",
      infoPlist: {
        NSPhotoLibraryUsageDescription: "We use your photo library so you can select a profile picture.",
        NSLocationWhenInUseUsageDescription: "We use your location to save and display your saved locations for emergency preparedness.",
      }
    },
    android: {
      package: "com.anonymous.panicproof",
      permissions: [
        "ACCESS_FINE_LOCATION"
      ],
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    plugins: ["expo-router"],
    experiments: {
      typedRoutes: true
    },
    extra: {
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      supabaseServiceRoleKey: process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
      geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY
    }
  }
}
