import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useUserStore } from '@/store/user-store';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import Button from '@/components/Button';
import { MapPin, Users, PawPrint, Baby, Heart } from 'lucide-react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useUserStore();
  
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [householdSize, setHouseholdSize] = useState(1);
  const [hasPets, setHasPets] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [hasElderly, setHasElderly] = useState(false);
  const [hasDisabled, setHasDisabled] = useState(false);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setLocation(profile.location);
      setHouseholdSize(profile.householdSize);
      setHasPets(profile.hasPets);
      setHasChildren(profile.hasChildren);
      setHasElderly(profile.hasElderly);
      setHasDisabled(profile.hasDisabled);
      setMedicalConditions(profile.medicalConditions);
    }
  }, [profile]);
  
  const handleSave = () => {
    updateProfile({
      name,
      location,
      householdSize,
      hasPets,
      hasChildren,
      hasElderly,
      hasDisabled,
      medicalConditions,
    });
    
    router.back();
  };
  
  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen options={{ 
        title: "Edit Profile",
        headerBackTitle: "",
      }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your Location</Text>
              <View style={styles.locationInputContainer}>
                <MapPin size={spacings.xl} color={colors.textTertiary} style={styles.locationIcon} />
                <TextInput
                  style={styles.locationInput}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="City, Country"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Household Size</Text>
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
              <Text style={styles.label}>Household Members Include:</Text>
              
              <View style={styles.optionRow}>
                <Button
                  title="Pets"
                  onPress={() => setHasPets(!hasPets)}
                  variant={hasPets ? "primary" : "outline"}
                  size="small"
                  style={styles.optionButton}
                  icon={<PawPrint size={spacings.screenPadding} color={hasPets ? colors.textInverse : colors.primary} />}
                  iconPosition="left"
                />
                
                <Button
                  title="Children"
                  onPress={() => setHasChildren(!hasChildren)}
                  variant={hasChildren ? "primary" : "outline"}
                  size="small"
                  style={styles.optionButton}
                  icon={<Baby size={spacings.screenPadding} color={hasChildren ? colors.textInverse : colors.primary} />}
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
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Medical Conditions (Optional)</Text>
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
          </View>
          
          <View style={styles.buttonsContainer}>
            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="outline"
              style={styles.button}
            />
            <Button
              title="Save Changes"
              onPress={handleSave}
              variant="primary"
              style={styles.button}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: spacings.screenPadding,
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: spacings.borderRadius.md,
    padding: spacings.screenPadding,
    marginBottom: spacings.screenPadding,
  },
  inputContainer: {
    marginBottom: spacings.screenPadding,
  },
  label: {
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: spacings.xs,
  },
});