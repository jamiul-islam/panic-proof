import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useUserStore } from '@/store/user-store';
import { colors } from '@/constants/colors';
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
      <Stack.Screen options={{ title: "Edit Profile" }} />
      
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
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your Location</Text>
              <View style={styles.locationInputContainer}>
                <MapPin size={20} color="#9CA3AF" style={styles.locationIcon} />
                <TextInput
                  style={styles.locationInput}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="City, Country"
                  placeholderTextColor="#9CA3AF"
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
                  icon={<PawPrint size={16} color={hasPets ? "#fff" : colors.primary} />}
                  iconPosition="left"
                />
                
                <Button
                  title="Children"
                  onPress={() => setHasChildren(!hasChildren)}
                  variant={hasChildren ? "primary" : "outline"}
                  size="small"
                  style={styles.optionButton}
                  icon={<Baby size={16} color={hasChildren ? "#fff" : colors.primary} />}
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
                placeholderTextColor="#9CA3AF"
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
    padding: 16,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});