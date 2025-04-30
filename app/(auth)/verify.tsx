import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';

export default function VerifyScreen() {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const router = useRouter();
  const { setAuthenticated } = useAuthStore();
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  
  const inputRefs = useRef<Array<TextInput | null>>([]);
  
  useEffect(() => {
    // Determine if we're in sign-in or sign-up flow
    setIsSigningIn(!!signIn?.status && signIn.status === 'needs_second_factor');
  }, [signIn?.status]);
  
  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) {
      // If pasting the entire code
      const pastedCode = text.slice(0, 6).split('');
      const newCode = [...code];
      
      pastedCode.forEach((char, i) => {
        if (i + index < 6) {
          newCode[i + index] = char;
        }
      });
      
      setCode(newCode);
      
      // Focus the last input or the next empty input
      const lastFilledIndex = newCode.findIndex(c => c === '') - 1;
      const focusIndex = lastFilledIndex >= 0 ? lastFilledIndex : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      // Normal single digit input
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
      
      // Auto-advance to next input
      if (text && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };
  
  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      if (isSigningIn) {
        // Handle 2FA verification during sign-in
        const result = await signIn!.attemptSecondFactor({
          strategy: 'phone_code',
          code: verificationCode,
        });
        
        if (result.status === 'complete') {
          setAuthenticated(true);
          router.replace('/(tabs)');
        }
      } else {
        // Handle email verification during sign-up
        const result = await signUp!.attemptEmailAddressVerification({
          code: verificationCode,
        });
        
        if (result.status === 'complete') {
          // Set the user as active
          await result.createdSessionId;
          setAuthenticated(true);
          router.replace('/onboarding');
        }
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.errors?.[0]?.message || 'Failed to verify code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    try {
      if (isSigningIn) {
        // Resend 2FA code
        await signIn!.prepareSecondFactor({
          strategy: 'phone_code',
        });
      } else {
        // Resend email verification code
        await signUp!.prepareEmailAddressVerification({ strategy: 'email_code' });
      }
      
      setError('');
    } catch (err: any) {
      console.error('Error resending code:', err);
      setError(err.errors?.[0]?.message || 'Failed to resend code. Please try again.');
    }
  };
  
  if (!isSignInLoaded || !isSignUpLoaded) {
    return null;
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            {isSigningIn ? 'Two-Factor Authentication' : 'Verify Your Email'}
          </Text>
          <Text style={styles.subtitle}>
            {isSigningIn 
              ? 'Enter the 6-digit code sent to your phone'
              : 'Enter the 6-digit code sent to your email'
            }
          </Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.codeInput}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={6} // Allow pasting full code
                selectTextOnFocus
                autoFocus={index === 0}
              />
            ))}
          </View>
          
          <Button
            title="Verify"
            onPress={handleVerify}
            variant="primary"
            isLoading={isLoading}
            disabled={code.some(digit => !digit) || isLoading}
            style={styles.button}
          />
          
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive a code?</Text>
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  errorText: {
    color: colors.danger,
    marginBottom: 16,
    fontSize: 14,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  codeInput: {
    width: 50,
    height: 60,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: '#F9FAFB',
    color: colors.text,
  },
  button: {
    marginBottom: 24,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resendText: {
    color: '#6B7280',
    fontSize: 14,
    marginRight: 4,
  },
  resendLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});