import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import Button from '@/components/Button';
import { Mail, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react-native';
import IconWrapper from '@/components/IconWrapper';

export default function ForgotPasswordScreen() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();
  
  // Form states
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const validateForm = () => {
    if (successfulCreation) {
      if (!newPassword.trim()) {
        setError('Please enter your new password');
        return false;
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters long');
        return false;
      }
      if (!code.trim()) {
        setError('Please enter the verification code');
        return false;
      }
    } else {
      if (!email.trim()) {
        setError('Please enter your email address');
        return false;
      }
    }
    return true;
  };
  
  // Send the password reset code to the user's email
  const handleSendResetCode = async () => {
    if (!isLoaded || !validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      
      setSuccessfulCreation(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Failed to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset the user's password with the code
  const handleResetPassword = async () => {
    if (!isLoaded || !validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
        password: newPassword,
      });
      
      if (result.status === 'complete') {
        // Set the active session (user is now signed in)
        await setActive({ session: result.createdSessionId });
        
        // Navigate to home screen
        router.replace('/(tabs)');
      } else if (result.status === 'needs_second_factor') {
        setError('Two-factor authentication required. Please complete setup in your account settings.');
      } else {
        setError('Password reset failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Failed to reset password. Please check your code and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconWrapper icon={ArrowLeft} size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.content}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            {!successfulCreation 
              ? "Enter your email address to receive a password reset code."
              : "Enter the verification code sent to your email and your new password."
            }
          </Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          {!successfulCreation ? (
            <>
              <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                  <IconWrapper icon={Mail} size={20} color={colors.textTertiary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              
              <Button
                title="Send Reset Code"
                onPress={handleSendResetCode}
                variant="primary"
                isLoading={isLoading}
                disabled={!email || isLoading}
                style={styles.button}
              />
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                  <IconWrapper icon={Mail} size={20} color={colors.textTertiary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Verification code"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                  <IconWrapper icon={Lock} size={20} color={colors.textTertiary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="New password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  placeholderTextColor={colors.textTertiary}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <IconWrapper 
                    icon={showNewPassword ? EyeOff : Eye} 
                    size={20} 
                    color={colors.textTertiary} 
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                  <IconWrapper icon={Lock} size={20} color={colors.textTertiary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor={colors.textTertiary}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <IconWrapper 
                    icon={showConfirmPassword ? EyeOff : Eye} 
                    size={20} 
                    color={colors.textTertiary} 
                  />
                </TouchableOpacity>
              </View>
              
              <Button
                title="Reset Password"
                onPress={handleResetPassword}
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading}
                style={styles.button}
              />
            </>
          )}
          
          <TouchableOpacity
            style={styles.signInContainer}
            onPress={() => router.push('/(auth)/sign-in')}
          >
            <Text style={styles.signInText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacings.xxl,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  backButton: {
    marginBottom: spacings.xxl,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: spacings.fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacings.sm,
  },
  subtitle: {
    fontSize: spacings.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacings.xxl,
    lineHeight: spacings.fontSize.md * 1.4,
  },
  errorText: {
    color: colors.danger,
    fontSize: spacings.fontSize.sm,
    marginBottom: spacings.lg,
    textAlign: 'center',
    backgroundColor: colors.dangerBackground,
    padding: spacings.md,
    borderRadius: spacings.borderRadius.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: spacings.borderRadius.sm,
    marginBottom: spacings.xxl,
    backgroundColor: colors.inputBackground,
  },
  iconContainer: {
    paddingHorizontal: spacings.md,
  },
  input: {
    flex: 1,
    height: spacings.heights.input,
    fontSize: spacings.fontSize.md,
    color: colors.text,
  },
  eyeButton: {
    paddingHorizontal: spacings.md,
  },
  button: {
    marginBottom: spacings.xxl,
  },
  signInContainer: {
    alignItems: 'center',
  },
  signInText: {
    color: colors.primary,
    fontSize: spacings.fontSize.md,
    fontWeight: '600',
  },
});