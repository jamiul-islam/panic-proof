import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { Mail, ArrowLeft } from 'lucide-react-native';
import IconWrapper from '@/components/IconWrapper';

export default function ForgotPasswordScreen() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleResetPassword = async () => {
    if (!isLoaded) return;
    
    setIsLoading(true);
    setError('');
    setIsSuccess(false);
    
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Error resetting password:', err);
      setError(err.errors?.[0]?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <IconWrapper icon={ArrowLeft} size={24} color={colors.text} />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {isSuccess ? (
          <Text style={styles.successText}>
            Reset instructions sent! Check your email for further instructions.
          </Text>
        ) : null}
        
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <IconWrapper icon={Mail} size={20} color="#9CA3AF" />
          </View>
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
        
        <Button
          title="Send Reset Instructions"
          onPress={handleResetPassword}
          variant="primary"
          isLoading={isLoading}
          disabled={!email || isLoading}
          style={styles.button}
        />
        
        <TouchableOpacity
          style={styles.signInContainer}
          onPress={() => router.push('/(auth)/sign-in')}
        >
          <Text style={styles.signInText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  backButton: {
    marginBottom: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  errorText: {
    color: colors.danger,
    marginBottom: 16,
    fontSize: 14,
  },
  successText: {
    color: colors.success,
    marginBottom: 16,
    fontSize: 14,
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 24,
    backgroundColor: '#F9FAFB',
  },
  iconContainer: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    marginBottom: 24,
  },
  signInContainer: {
    alignItems: 'center',
  },
  signInText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});