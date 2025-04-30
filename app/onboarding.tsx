import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/user-store';
import { useAuthStore } from '@/store/auth-store';
import { useAuth } from '@clerk/clerk-expo';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { Shield, MapPin, Users, PawPrint, Baby, Heart } from 'lucide-react-native';
import IconWrapper from '@/components/IconWrapper';

export default function OnboardingScreen() {
  const router = useRouter();
  const { setProfile } = useUserStore();
  const { setOnboardingCompleted } = useAuthStore();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.fullName || '');
  const [location, setLocation] = useState('');
  const [householdSize, setHouseholdSize] = useState(1);
  const [hasPets, setHasPets] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [hasElderly, setHasElderly] = useState(false);
  const [hasDisabled, setHasDisabled] = useState(false);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  
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
    setProfile({
      id: user?.id || "user1",
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
      customKit: []
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
      <Text style={styles.stepDescription}>
        Let's set up your profile to personalize your disaster preparedness experience.
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Your Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#9CA3AF"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Your Location</Text>
        <View style={styles.locationInputContainer}>
          <IconWrapper icon={MapPin} size={20} color="#9CA3AF" style={styles.locationIcon} />
          <TextInput
            style={styles.locationInput}
            value={location}
            onChangeText={setLocation}
            placeholder="City, Country"
            placeholderTextColor="#9CA3AF"
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
            icon={<IconWrapper icon={PawPrint} size={16} color={hasPets ? "#fff" : colors.primary} />}
            iconPosition="left"
          />
          
          <Button
            title="Children"
            onPress={() => setHasChildren(!hasChildren)}
            variant={hasChildren ? "primary" : "outline"}
            size="small"
            style={styles.optionButton}
            icon={<IconWrapper icon={Baby} size={16} color={hasChildren ? "#fff" : colors.primary} />}
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
          placeholderTextColor="#9CA3AF"
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
    padding: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  activeProgressDot: {
    backgroundColor: colors.primary,
  },
  progressLine: {
    height: 2,
    width: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  activeProgressLine: {
    backgroundColor: colors.primary,
  },
  stepContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: '90%',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 40,
    height: 40,
  },
  counterValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  optionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  privacyNote: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  backButton: {
    flex: 1,
    marginRight: 8,
  },
  nextButton: {
    flex: 1,
    marginLeft: 8,
  },
  fullWidthButton: {
    flex: 1,
  },
});