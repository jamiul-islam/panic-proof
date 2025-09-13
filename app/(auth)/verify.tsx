import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useSignIn, useSignUp, useClerk, useUser } from '@clerk/clerk-expo';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import { ArrowLeft } from 'lucide-react-native';
import IconWrapper from '@/components/IconWrapper';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { useUserStore } from '@/store/user-store';
import { AuthFlowHelper } from '@/utils/auth-flow';

export default function VerifyScreen() {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const { setActive } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const { setAuthenticated, setOnboardingCompleted } = useAuthStore();
  const { loadUserProfile } = useUserStore();
  const { firstName, lastName } = useLocalSearchParams<{ firstName?: string; lastName?: string }>();
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(165); // 2:45 in seconds
  
  // Check if we can go back (if there's a route in the history)
  const canGoBack = router.canGoBack();
  
  const inputRefs = useRef<Array<TextInput | null>>([]);
  
  useEffect(() => {
    // Determine if we're in sign-in or sign-up flow
    setIsSigningIn(!!signIn?.status && signIn.status === 'needs_second_factor');
  }, [signIn?.status]);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
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
          // Set the session as active
          await setActive({ session: result.createdSessionId });
          
          setAuthenticated(true);
          
          // Check if user exists in Supabase for sign-in
          try {
            const clerkUserId = user?.id;
            if (clerkUserId) {
              const supabaseUser = await AuthFlowHelper.handleSignIn(clerkUserId);
              if (supabaseUser) {
                setOnboardingCompleted(true);
                try {
                  await loadUserProfile(clerkUserId);
                } catch {}
                router.replace('/(tabs)');
              } else {
                // User doesn't exist in Supabase, needs onboarding
                setOnboardingCompleted(false);
                router.replace('/onboarding');
              }
            } else {
              router.replace('/(tabs)');
            }
          } catch (error) {
            console.error('Error checking user in Supabase during sign-in:', error);
            router.replace('/(tabs)'); // Fallback to tabs
          }
        }
      } else {
        // Handle email verification during sign-up
        const result = await signUp!.attemptEmailAddressVerification({
          code: verificationCode,
        });
        
        if (result.status === 'complete') {
          // Set the session as active - this is critical for proper auth state
          await setActive({ session: result.createdSessionId });
          
          // Small delay to ensure session is fully established
          await new Promise(resolve => setTimeout(resolve, 100));
          
          setAuthenticated(true);
          
          // For signup, always go to onboarding as user doesn't exist in Supabase yet
          setOnboardingCompleted(false);
          
          // Navigate to onboarding with user data if available
          if (firstName && lastName) {
            router.replace({
              pathname: '/onboarding',
              params: { firstName, lastName }
            });
          } else {
            router.replace('/onboarding');
          }
        }
      }
    } catch (err: any) {
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
      setError(err.errors?.[0]?.message || 'Failed to resend code. Please try again.');
    }
  };
  
  if (!isSignInLoaded || !isSignUpLoaded) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF6FF" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
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

        <View style={[styles.content, !canGoBack && styles.contentNoBack]}>
          {/* Title and Subtitle */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Verification</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to your email
            </Text>
          </View>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          {/* Code Input Container */}
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.codeInput,
                  digit ? styles.codeInputFilled : null
                ]}
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
          
          {/* Verify Button */}
          <Button
            title="Verify"
            onPress={handleVerify}
            variant="primary"
            size="large"
            isLoading={isLoading}
            disabled={code.some(digit => !digit) || isLoading}
            style={styles.button}
          />
          
          {/* Resend Code */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive a code? </Text>
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resendLink}>Resend</Text>
            </TouchableOpacity>
          </View>

          {/* Timer */}
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              Code expires in <Text style={styles.timerHighlight}>{formatTime(timeLeft)}</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF6FF', // Light blue background matching Figma
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 124,
    left: 24,
    zIndex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 188, // Position content below back button
  },
  contentNoBack: {
    paddingTop: 124, // Less top padding when there's no back button
  },
  headerContainer: {
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A', // Blue-900 matching Figma
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B', // Slate-500 matching Figma
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 16,
    fontSize: 14,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  codeInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#E2E8F0', // Slate-200 matching Figma
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    color: '#1E3A8A', // Blue-900 for text
  },
  codeInputFilled: {
    color: '#1E3A8A', // Blue-900 for filled inputs
  },
  button: {
    marginBottom: 26,
    height: 56,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resendText: {
    color: '#64748B', // Slate-500
    fontSize: 14,
  },
  resendLink: {
    color: '#2563EB', // Blue-600 matching Figma
    fontSize: 14,
    fontWeight: 'bold',
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    color: '#64748B', // Slate-500
    fontSize: 12,
  },
  timerHighlight: {
    color: '#1E3A8A', // Blue-900 for timer
    fontWeight: '400',
  },
});
