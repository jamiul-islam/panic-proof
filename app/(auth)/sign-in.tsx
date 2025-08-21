import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSignIn, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import IconWrapper from '@/components/IconWrapper';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { AuthFlowHelper } from '@/utils/auth-flow';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { user } = useUser();
  const router = useRouter();
  const { setAuthenticated, setOnboardingCompleted, setUserData } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Check if we can go back (if there's a route in the history)
  const canGoBack = router.canGoBack();

  const handleSignIn = async () => {
    if (!isLoaded) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      
      // Check if 2FA is required
      if (result.status === 'needs_second_factor') {
        router.push('/(auth)/verify');
        return;
      }
      
      // Set the user as active
      await setActive({ session: result.createdSessionId });
      
      // Small delay to ensure session is fully established
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setAuthenticated(true);
      
      // Check if user exists in Supabase
      try {
        const clerkUserId = user?.id;
        const clerkEmail = user?.emailAddresses?.[0]?.emailAddress;
        
        if (clerkUserId && clerkEmail) {
          // Store user data in auth store
          setUserData(clerkUserId, clerkEmail);
          
          const supabaseUser = await AuthFlowHelper.handleSignIn(clerkUserId);
          if (supabaseUser) {
            setOnboardingCompleted(true);
            router.replace('/(tabs)');
          } else {
            // User doesn't exist in Supabase, needs onboarding
            setOnboardingCompleted(false);
            router.replace('/onboarding');
          }
        } else {
          // Fallback if no user ID available
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Error checking user in Supabase during sign-in:', error);
        // Fallback to tabs if there's an error
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = () => {
    router.push('/(auth)/sign-up');
  };
  
  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.textInverse} />                  
      
      {/* Main Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button - only show if we can go back */}
          {canGoBack && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <IconWrapper icon={ArrowLeft} size={24} color={colors.text} />
            </TouchableOpacity>
          )}

          {/* Welcome Text */}
          <View style={[styles.welcomeContainer, !canGoBack && styles.welcomeContainerNoBack]}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>Sign in to continue</Text>
          </View>
          
          {/* Form Container */}
          <View style={styles.formContainer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            {/* Email Input */}
            <View style={styles.inputContainer}>
                            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            
            {/* Password Input */}
            <View style={styles.inputContainer}>
                            <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={colors.textTertiary}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <IconWrapper 
                  icon={showPassword ? EyeOff : Eye} 
                  size={20} 
                  color={colors.textTertiary} 
                />
              </TouchableOpacity>
            </View>
            
            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            {/* Sign In Button */}
            <Button
              title={isLoading ? 'Signing In...' : 'Sign In'}
              onPress={handleSignIn}
              variant="primary"
              size="large"
              isLoading={isLoading}
              disabled={!email || !password || isLoading}
              style={styles.signInButton}
            />
          </View>
          
          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBadge,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacings.xl,
    height: 44,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  statusTime: {
    fontSize: spacings.fontSize.sm,
    fontWeight: '500',
    color: colors.text,
  },
  statusIcons: {
    flexDirection: 'row',
    gap: spacings.sm,
    width: 64,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacings.xxl,
    justifyContent: 'center',
    minHeight: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: spacings.xxl,
    zIndex: 1,
    padding: spacings.sm,
  },
  welcomeContainer: {
    marginBottom: spacings.xxxxl,
  },
  welcomeContainerNoBack: {
    marginTop: 0,
  },
  welcomeTitle: {
    fontSize: spacings.fontSize.xxxl - 4,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacings.sm,
  },
  welcomeSubtitle: {
    fontSize: spacings.fontSize.md,
    color: colors.textSecondary,
  },
  formContainer: {
    gap: spacings.lg,
  },
  errorText: {
    color: colors.danger,
    marginBottom: spacings.lg,
    fontSize: spacings.fontSize.sm,
  },
  inputContainer: {
    backgroundColor: colors.textInverse,
    borderRadius: spacings.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    height: spacings.heights.input + 6,
    paddingHorizontal: spacings.lg,
    justifyContent: 'center',
  },
  input: {
    fontSize: spacings.fontSize.md,
    color: colors.text,
    height: '100%',
  },
  passwordInput: {
    fontSize: spacings.fontSize.md,
    color: colors.text,
    height: '100%',
    paddingRight: spacings.xxxxl,
  },
  eyeIcon: {
    position: 'absolute',
    right: spacings.lg,
    padding: spacings.xs,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: spacings.sm,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: spacings.fontSize.sm,
  },
  signInButton: {
    marginBottom: spacings.xl,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacings.xl,
  },
  signUpText: {
    color: colors.textSecondary,
    fontSize: spacings.fontSize.sm,
  },
  signUpLink: {
    color: colors.primary,
    fontSize: spacings.fontSize.sm,
    fontWeight: 'bold',
  },
  homeIndicator: {
    backgroundColor: colors.text,
    height: 5,
    width: 134,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: spacings.xl,
  },
});