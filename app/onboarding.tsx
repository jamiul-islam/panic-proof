import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/user-store';
import { useAuthStore } from '@/store/auth-store';
import { useUser } from '@clerk/clerk-expo';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import Button from '@/components/Button';
import { Shield, MapPin, Users, PawPrint, Baby, Heart } from 'lucide-react-native';
import IconWrapper from '@/components/IconWrapper';

export default function OnboardingScreen() {
  const router = useRouter();
  const { setProfile } = useUserStore();
  const { setOnboardingCompleted } = useAuthStore();
  const { user } = useUser();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.fullName || user?.firstName || '');
  const [location, setLocation] = useState('');
  const [householdSize, setHouseholdSize] = useState(1);
  const [hasPets, setHasPets] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [hasElderly, setHasElderly] = useState(false);
  const [hasDisabled, setHasDisabled] = useState(false);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  
  // Update name when user data becomes available
  useEffect(() => {
    console.log('User data:', { id: user?.id, fullName: user?.fullName, firstName: user?.firstName });
    if (user?.fullName) {
      setName(user.fullName);
    } else if (user?.firstName) {
      setName(user.firstName);
    }
  }, [user?.fullName, user?.firstName]);
  
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
  
  const completeOnboarding = () => {
    const profileId = user?.id || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Creating profile for user:', profileId);
    
    setProfile({
      id: profileId,
      name,
      location,
      householdSize,
      hasPets,
      hasChildren,
      hasElderly,
      hasDisabled,
      medicalConditions,
      emergencyContacts: [],
      completedTasks: [],
      points: 0,
      level: 1,
      badges: [],
      customKit: [],
      customChecklists: []
    });
    
    setOnboardingCompleted(true);
    router.replace('/(tabs)');
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
            disabled={step === 1 && (!name || !location)}
          />
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
});