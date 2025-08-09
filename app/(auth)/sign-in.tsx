import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import IconWrapper from '@/components/IconWrapper';
import Button from '@/components/Button';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  
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
    } catch (err: any) {
      console.error('Error signing in:', err);
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
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />                  
      
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
              <IconWrapper icon={ArrowLeft} size={24} color="#000000" />
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
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#9CA3AF"
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
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <IconWrapper 
                  icon={showPassword ? EyeOff : Eye} 
                  size={20} 
                  color="#9CA3AF" 
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
    backgroundColor: '#EFF6FF', // Light blue background to simulate gradient
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 44,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  statusTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 8,
    width: 64,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    minHeight: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 60, // Account for status bar + extra spacing
    left: 24,
    zIndex: 1,
    padding: 8,
  },
  welcomeContainer: {
    marginBottom: 40,
  },
  welcomeContainerNoBack: {
    marginTop: 0, // No extra margin needed since content is centered
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A', // Blue-900
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#64748B', // Slate-500
  },
  formContainer: {
    gap: 16,
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 16,
    fontSize: 14,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0', // Slate-200
    height: 56,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    color: '#1F2937',
    height: '100%',
  },
  passwordInput: {
    fontSize: 16,
    color: '#1F2937',
    height: '100%',
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: '#2563EB', // Blue-600
    fontSize: 14,
  },
  signInButton: {
    marginBottom: 20,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signUpText: {
    color: '#64748B',
    fontSize: 14,
  },
  signUpLink: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: 'bold',
  },
  homeIndicator: {
    backgroundColor: '#000000',
    height: 5,
    width: 134,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 20,
  },
});