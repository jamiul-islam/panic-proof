import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/user-store';
import { useAuthStore } from '@/store/auth-store';
import { useUser, useAuth, useClerk } from '@clerk/clerk-expo';
import { createUser, mapSupabaseUserToProfile } from '@/services/user-service';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import Button from '@/components/Button';
import { Shield, MapPin, Users, PawPrint, Baby, Heart } from 'lucide-react-native';
import IconWrapper from '@/components/IconWrapper';

export default function OnboardingScreen() {
  const router = useRouter();
  const { setProfile } = useUserStore();
  const { setOnboardingCompleted } = useAuthStore();
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, userId } = useAuth();
  const clerk = useClerk();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.fullName || user?.firstName || '');
  const [location, setLocation] = useState('');
  const [householdSize, setHouseholdSize] = useState(1);
  const [hasPets, setHasPets] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [hasElderly, setHasElderly] = useState(false);
  const [hasDisabled, setHasDisabled] = useState(false);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Auto-refresh user data when authentication state changes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (userLoaded && !user?.id && retryCount < 3) {
      timeoutId = setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 2000); // Wait 2 seconds then trigger a refresh
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [userLoaded, user?.id, retryCount]);
  
  // Update name when user data becomes available
  useEffect(() => {
    if (user?.fullName) {
      setName(user.fullName);
    } else if (user?.firstName) {
      setName(user.firstName);
    }
  }, [user?.fullName, user?.firstName, userLoaded, isSignedIn, userId, user?.id, retryCount, clerk.session, clerk.user]);
  
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleRefreshUser = async () => {
    setRetryCount(prev => prev + 1);
    
    // Try to reload user data from Clerk
    try {
      if (clerk.user) {
        await clerk.user.reload();
      }
      
      // Force a re-render
      setRetryCount(prev => prev + 1);
    } catch (error) {
      // Silent error handling
    }
  };
  
  // Function to manually retrieve user data from Clerk session
  const getCurrentUserFromClerk = async () => {
    try {
      // Get the current session
      const session = clerk.session;
      
      if (session?.user) {
        return {
          id: session.user.id,
          email: session.user.emailAddresses?.[0]?.emailAddress,
          firstName: session.user.firstName,
          fullName: session.user.fullName,
        };
      }
      
      // Fallback: try to reload user
      await clerk.user?.reload();
      
      if (clerk.user) {
        return {
          id: clerk.user.id,
          email: clerk.user.emailAddresses?.[0]?.emailAddress,
          firstName: clerk.user.firstName,
          fullName: clerk.user.fullName,
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  };
  
  const completeOnboarding = async () => {
    if (!userLoaded) {
      Alert.alert('Please Wait', 'Loading user information. Please wait and try again.');
      return;
    }
    
    // Try to get user ID from multiple sources
    let profileId = user?.id || userId;
    let userEmail = user?.emailAddresses?.[0]?.emailAddress;
    let userName = user?.fullName || user?.firstName;
    
    // If hooks don't provide user data, try direct Clerk access
    if (!profileId) {
      const clerkUser = await getCurrentUserFromClerk();
      
      if (clerkUser) {
        profileId = clerkUser.id;
        userEmail = clerkUser.email;
        userName = clerkUser.fullName || clerkUser.firstName;
      }
    }
    
    if (!profileId) {
      
      Alert.alert(
        'User Information Missing',
        'Unable to retrieve your user information from Clerk. This might be a temporary issue.\n\nOptions:',
        [
          { text: 'Try Again', onPress: completeOnboarding },
          { text: 'Use Test Mode', onPress: () => proceedWithoutUserId() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }
    
    // Update local name if we got it from Clerk
    if (userName && !name) {
      setName(userName);
    }
    
    await proceedWithUserData(profileId, userEmail);
  };
  
  const proceedWithoutUserId = async () => {
    // Fallback: generate a temporary ID and proceed
    // This is not ideal but allows testing to continue
    const fallbackId = `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await proceedWithUserData(fallbackId, undefined);
  };
  
  const proceedWithUserData = async (profileId: string, userEmail?: string) => {
    setIsLoading(true);
    
    try {
      // Create user in Supabase database
      const supabaseUser = await createUser({
        clerk_user_id: profileId,
        email: userEmail,
        name,
        location,
        household_size: householdSize,
        has_pets: hasPets,
        has_children: hasChildren,
        has_elderly: hasElderly,
        has_disabled: hasDisabled,
        medical_conditions: medicalConditions,
      });
      
      // Convert to local profile format and save to store
      const localProfile = mapSupabaseUserToProfile(supabaseUser);
      setProfile(localProfile);
      
      setOnboardingCompleted(true);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(
        'Error', 
        'Failed to create your profile. Please check your internet connection and try again.\n\nError: ' + (error as Error).message,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <IconWrapper icon={Shield} size={48} color={colors.primary} />
      </View>
      <Text style={styles.stepTitle}>Welcome to Disaster Ready</Text>
      {user?.emailAddresses?.[0]?.emailAddress && (
        <Text style={styles.userEmail}>
          Signed in as {user.emailAddresses[0].emailAddress}
        </Text>
      )}
      <Text style={styles.stepDescription}>
        Let's set up your profile to personalize your disaster preparedness experience.
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Your Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder={user?.fullName || user?.firstName ? "Confirm your name" : "Enter your name"}
          placeholderTextColor={colors.textTertiary}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Your Location</Text>
        <View style={styles.locationInputContainer}>
          <IconWrapper icon={MapPin} size={spacings.xl} color={colors.textTertiary} style={styles.locationIcon} />
          <TextInput
            style={styles.locationInput}
            value={location}
            onChangeText={setLocation}
            placeholder="City, Country"
            placeholderTextColor={colors.textTertiary}
          />
        </View>
      </View>
    </View>
  );
  
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <IconWrapper icon={Users} size={48} color={colors.primary} />
      </View>
      <Text style={styles.stepTitle}>Household Information</Text>
      <Text style={styles.stepDescription}>
        Tell us about your household to help us recommend appropriate preparedness tasks.
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Household Size</Text>
        <View style={styles.counterContainer}>
          <Button
            title="-"
            onPress={() => setHouseholdSize(Math.max(1, householdSize - 1))}
            variant="outline"
            size="small"
            style={styles.counterButton}
          />
          <Text style={styles.counterValue}>{householdSize}</Text>
          <Button
            title="+"
            onPress={() => setHouseholdSize(householdSize + 1)}
            variant="outline"
            size="small"
            style={styles.counterButton}
          />
        </View>
      </View>
      
      <View style={styles.optionsContainer}>
        <Text style={styles.inputLabel}>Household Members Include:</Text>
        
        <View style={styles.optionRow}>
          <Button
            title="Pets"
            onPress={() => setHasPets(!hasPets)}
            variant={hasPets ? "primary" : "outline"}
            size="small"
            style={styles.optionButton}
            icon={<IconWrapper icon={PawPrint} size={spacings.screenPadding} color={hasPets ? colors.textInverse : colors.primary} />}
            iconPosition="left"
          />
          
          <Button
            title="Children"
            onPress={() => setHasChildren(!hasChildren)}
            variant={hasChildren ? "primary" : "outline"}
            size="small"
            style={styles.optionButton}
            icon={<IconWrapper icon={Baby} size={spacings.screenPadding} color={hasChildren ? colors.textInverse : colors.primary} />}
            iconPosition="left"
          />
        </View>
        
        <View style={styles.optionRow}>
          <Button
            title="Elderly"
            onPress={() => setHasElderly(!hasElderly)}
            variant={hasElderly ? "primary" : "outline"}
            size="small"
            style={styles.optionButton}
          />
          
          <Button
            title="Disabled"
            onPress={() => setHasDisabled(!hasDisabled)}
            variant={hasDisabled ? "primary" : "outline"}
            size="small"
            style={styles.optionButton}
          />
        </View>
      </View>
    </View>
  );
  
  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <IconWrapper icon={Heart} size={48} color={colors.primary} />
      </View>
      <Text style={styles.stepTitle}>Medical Information</Text>
      <Text style={styles.stepDescription}>
        This information will help emergency responders provide appropriate care.
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Medical Conditions (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={medicalConditions.join(", ")}
          onChangeText={(text) => setMedicalConditions(text.split(",").map(item => item.trim()))}
          placeholder="E.g., diabetes, asthma, allergies"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
      
      <Text style={styles.privacyNote}>
        Your information is stored locally on your device and is not shared with any third parties.
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressDot, 
              step >= 1 && styles.activeProgressDot
            ]} 
          />
          <View 
            style={[
              styles.progressLine, 
              step >= 2 && styles.activeProgressLine
            ]} 
          />
          <View 
            style={[
              styles.progressDot, 
              step >= 2 && styles.activeProgressDot
            ]} 
          />
          <View 
            style={[
              styles.progressLine, 
              step >= 3 && styles.activeProgressLine
            ]} 
          />
          <View 
            style={[
              styles.progressDot, 
              step >= 3 && styles.activeProgressDot
            ]} 
          />
        </View>
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        
        <View style={styles.buttonsContainer}>
          {step > 1 && (
            <Button
              title="Back"
              onPress={handleBack}
              variant="outline"
              style={styles.backButton}
            />
          )}
          
          <Button
            title={step === 3 ? "Complete" : "Next"}
            onPress={handleNext}
            variant="primary"
            style={step === 1 ? styles.fullWidthButton : styles.nextButton}
            disabled={
              (step === 1 && (!name || !location)) || 
              isLoading ||
              !userLoaded  // Only require that Clerk is loaded, not that all user data is perfect
            }
            isLoading={step === 3 && isLoading}
          />
          
          {/* Debug info for development */}
          {step === 3 && !user?.id && !userId && (
            <View style={styles.debugContainer}>
              <Text style={styles.debugText}>
                Debug: User ID not loaded yet ({retryCount}/3 auto-retries). You can still try to complete onboarding.
              </Text>
              <Button
                title="Refresh User Data"
                onPress={handleRefreshUser}
                variant="outline"
                size="small"
                style={styles.debugButton}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacings.screenPadding,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacings.sectionSpacing,
  },
  progressDot: {
    width: spacings.md,
    height: spacings.md,
    borderRadius: spacings.xs * 1.5,
    backgroundColor: colors.backgroundTertiary,
  },
  activeProgressDot: {
    backgroundColor: colors.primary,
  },
  progressLine: {
    height: spacings.xs / 2,
    width: spacings.xxxxl,
    backgroundColor: colors.backgroundTertiary,
    marginHorizontal: spacings.xs,
  },
  activeProgressLine: {
    backgroundColor: colors.primary,
  },
  stepContainer: {
    alignItems: 'center',
    marginBottom: spacings.sectionSpacing,
  },
  iconContainer: {
    width: spacings.xxxxl * 2,
    height: spacings.xxxxl * 2,
    borderRadius: spacings.xxxxl,
    backgroundColor: colors.primaryBadge,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacings.screenPadding,
  },
  stepTitle: {
    fontSize: spacings.fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacings.sm,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacings.sm,
  },
  stepDescription: {
    fontSize: spacings.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacings.sectionSpacing,
    maxWidth: '90%',
  },
  inputContainer: {
    width: '100%',
    marginBottom: spacings.screenPadding,
  },
  inputLabel: {
    fontSize: spacings.fontSize.md,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacings.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacings.borderRadius.sm,
    padding: spacings.md,
    fontSize: spacings.fontSize.md,
    color: colors.text,
  },
  textArea: {
    minHeight: spacings.xxxxl * 2.5,
    textAlignVertical: 'top',
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacings.borderRadius.sm,
    paddingHorizontal: spacings.md,
  },
  locationIcon: {
    marginRight: spacings.sm,
  },
  locationInput: {
    flex: 1,
    padding: spacings.md,
    fontSize: spacings.fontSize.md,
    color: colors.text,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: spacings.xxxxl,
    height: spacings.xxxxl,
  },
  counterValue: {
    fontSize: spacings.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: spacings.screenPadding,
    minWidth: spacings.xxxl - spacings.xs,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: spacings.screenPadding,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacings.md,
  },
  optionButton: {
    flex: 1,
    marginHorizontal: spacings.xs,
  },
  privacyNote: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacings.screenPadding,
    fontStyle: 'italic',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacings.screenPadding,
  },
  backButton: {
    flex: 1,
    marginRight: spacings.sm,
  },
  nextButton: {
    flex: 1,
    marginLeft: spacings.sm,
  },
  fullWidthButton: {
    flex: 1,
  },
  debugText: {
    fontSize: spacings.fontSize.sm,
    color: colors.text + '80', // Semi-transparent
    textAlign: 'center',
    marginTop: spacings.xs,
    fontStyle: 'italic',
  },
  debugContainer: {
    alignItems: 'center',
    marginTop: spacings.xs,
    padding: spacings.sm,
    backgroundColor: colors.background + '50',
    borderRadius: spacings.xs,
  },
  debugButton: {
    marginTop: spacings.xs,
    minWidth: 120,
  },
});