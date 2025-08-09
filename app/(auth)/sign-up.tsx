import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import IconWrapper from '@/components/IconWrapper';
import Button from '@/components/Button';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if we can go back (if there's a route in the history)
  const canGoBack = router.canGoBack();

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Validate password match
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      // Create the Clerk account with email and password
      await signUp.create({
        emailAddress: email,
        password,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      
      // Navigate to verify screen with user data
      router.push({
        pathname: '/(auth)/verify',
        params: { firstName, lastName }
      });
    } catch (err: any) {
      console.error('Sign up error:', JSON.stringify(err, null, 2));
      alert(`Sign up failed: ${err.errors?.[0]?.message || err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E0F2FE" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
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

          <View style={styles.content}>
            <View style={[styles.titleContainer, !canGoBack && styles.titleContainerNoBack]}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up to get started</Text>
            </View>

            {/* First Name Input */}
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
              style={styles.input}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />

            {/* Last Name Input */}
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
              style={styles.input}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />

            {/* Email Input */}
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              style={styles.input}
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Password Input */}
            <View style={styles.passwordContainer}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                style={styles.passwordInput}
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <IconWrapper 
                  icon={showPassword ? EyeOff : Eye} 
                  size={20} 
                  color="#9CA3AF" 
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.passwordContainer}>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
                style={styles.passwordInput}
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <IconWrapper 
                  icon={showConfirmPassword ? EyeOff : Eye} 
                  size={20} 
                  color="#9CA3AF" 
                />
              </TouchableOpacity>
            </View>

            <Button
              title={loading ? "Creating Account..." : "Sign Up"}
              onPress={onSignUpPress}
              variant="primary"
              size="large"
              isLoading={loading}
              disabled={loading || !firstName || !lastName || !email || !password || !confirmPassword}
              style={styles.button}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?{' '}
                <Text 
                  style={styles.signInLink}
                  onPress={() => router.push('/sign-in')}
                >
                  Sign In
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE', // Light blue background matching sign-in
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
    paddingTop: 60, // Account for status bar + extra spacing
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginBottom: 40,
    padding: 8,
  },
  titleContainer: {
    marginBottom: 40,
  },
  titleContainerNoBack: {
    marginTop: 40, // Add top margin when there's no back button for spacing
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 56, // Consistent height from Figma
  },
  passwordContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    height: 56, // Consistent height from Figma
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  eyeButton: {
    padding: 4,
  },
  button: {
    marginTop: 24,
    marginBottom: 20,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
  },
  signInLink: {
    color: '#2563EB',
    fontWeight: '600',
  },
});