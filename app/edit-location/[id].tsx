import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import { MapPin, Home, Briefcase, Heart, Search } from 'lucide-react-native';
import Button from '@/components/Button';
import IconWrapper from '@/components/IconWrapper';
import { useUserStore } from '@/store/user-store';

export default function EditLocationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile, updateSavedLocation } = useUserStore();
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [locationType, setLocationType] = useState<'home' | 'work' | 'favorite' | 'other'>('home');
  const [isPrimary, setIsPrimary] = useState(false);
  
  // Load existing location data
  useEffect(() => {
    if (profile?.savedLocations && id) {
      const location = profile.savedLocations.find(loc => loc.id === id);
      if (location) {
        setName(location.name);
        setAddress(location.address);
        setLocationType(location.type);
        setIsPrimary(location.isPrimary);
      }
    }
  }, [profile, id]);
  
  const handleSave = () => {
    // Validate required fields
    if (!name.trim() || !address.trim()) {
      Alert.alert(
        "Missing Information",
        "Please fill in both location name and address.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!id) {
      Alert.alert("Error", "Location ID not found.");
      return;
    }

    // Update the location
    const updates = {
      name: name.trim(),
      address: address.trim(),
      type: locationType,
      isPrimary
    };

    updateSavedLocation(id, updates);

    // Show success message and go back
    Alert.alert(
      "Location Updated",
      "Your location has been successfully updated.",
      [{ 
        text: "OK", 
        onPress: () => router.back() 
      }]
    );
  };
  
  return (
    <>
      <Stack.Screen options={{ 
        title: "Edit Location",
        headerBackTitle: "",
      }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="E.g., Home, Work, Parents' House"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <View style={styles.addressInputContainer}>
                <IconWrapper icon={Search} size={spacings.xl} color={colors.textTertiary} style={styles.searchIcon} />
                <TextInput
                  style={styles.addressInput}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Search for an address"
                  placeholderTextColor={colors.textTertiary}
                  multiline={true}
                  numberOfLines={2}
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location Type</Text>
              <View style={styles.locationTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.locationTypeButton,
                    locationType === 'home' && styles.selectedLocationType,
                  ]}
                  onPress={() => setLocationType('home')}
                >
                  <IconWrapper 
                    icon={Home} 
                    size={spacings.xl} 
                    color={locationType === 'home' ? colors.textInverse : colors.text} 
                  />
                  <Text 
                    style={[
                      styles.locationTypeText,
                      locationType === 'home' && styles.selectedLocationTypeText,
                    ]}
                  >
                    Home
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.locationTypeButton,
                    locationType === 'work' && styles.selectedLocationType,
                    locationType === 'work' && { backgroundColor: colors.secondary },
                  ]}
                  onPress={() => setLocationType('work')}
                >
                  <IconWrapper 
                    icon={Briefcase} 
                    size={spacings.xl} 
                    color={locationType === 'work' ? colors.textInverse : colors.text} 
                  />
                  <Text 
                    style={[
                      styles.locationTypeText,
                      locationType === 'work' && styles.selectedLocationTypeText,
                    ]}
                  >
                    Work
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.locationTypeButton,
                    locationType === 'favorite' && styles.selectedLocationType,
                    locationType === 'favorite' && { backgroundColor: colors.danger },
                  ]}
                  onPress={() => setLocationType('favorite')}
                >
                  <IconWrapper 
                    icon={Heart} 
                    size={spacings.xl} 
                    color={locationType === 'favorite' ? colors.textInverse : colors.text} 
                  />
                  <Text 
                    style={[
                      styles.locationTypeText,
                      locationType === 'favorite' && styles.selectedLocationTypeText,
                    ]}
                  >
                    Favorite
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.locationTypeButton,
                    locationType === 'other' && styles.selectedLocationType,
                    locationType === 'other' && { backgroundColor: colors.text },
                  ]}
                  onPress={() => setLocationType('other')}
                >
                  <IconWrapper 
                    icon={MapPin} 
                    size={spacings.xl} 
                    color={locationType === 'other' ? colors.textInverse : colors.text} 
                  />
                  <Text 
                    style={[
                      styles.locationTypeText,
                      locationType === 'other' && styles.selectedLocationTypeText,
                    ]}
                  >
                    Other
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={[styles.checkbox, isPrimary && styles.checkedCheckbox]}
                  onPress={() => setIsPrimary(!isPrimary)}
                >
                  {isPrimary && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
                <View style={styles.checkboxLabelContainer}>
                  <Text style={styles.checkboxLabel}>Set as primary location</Text>
                  <Text style={styles.checkboxDescription}>
                    This will be your default location for alerts and recommendations
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title="Update Location"
            onPress={handleSave}
            variant="primary"
            disabled={!name.trim() || !address.trim()}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: spacings.screenPadding,
  },
  inputContainer: {
    marginBottom: spacings.sectionSpacing,
  },
  label: {
    fontSize: spacings.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacings.xs,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacings.borderRadius.xs,
    paddingHorizontal: spacings.screenPadding,
    paddingVertical: spacings.md,
    fontSize: spacings.fontSize.md,
    color: colors.text,
  },
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacings.borderRadius.xs,
    paddingHorizontal: spacings.screenPadding,
    paddingVertical: spacings.md,
  },
  searchIcon: {
    marginTop: 2,
    marginRight: spacings.md,
  },
  addressInput: {
    flex: 1,
    fontSize: spacings.fontSize.md,
    color: colors.text,
    minHeight: spacings.heights.button,
    textAlignVertical: 'top',
  },
  locationTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacings.md,
  },
  locationTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacings.borderRadius.xs,
    paddingHorizontal: spacings.screenPadding,
    paddingVertical: spacings.md,
    minWidth: spacings.xxxxl + spacings.xxxxl,
  },
  selectedLocationType: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  locationTypeText: {
    fontSize: spacings.fontSize.sm,
    fontWeight: '500',
    color: colors.text,
    marginLeft: spacings.xs,
  },
  selectedLocationTypeText: {
    color: colors.textInverse,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: spacings.sectionSpacing,
    height: spacings.sectionSpacing,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: spacings.xs,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacings.md,
    marginTop: 2,
  },
  checkedCheckbox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.textInverse,
    fontSize: spacings.fontSize.sm,
    fontWeight: 'bold',
  },
  checkboxLabelContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: spacings.fontSize.md,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacings.xs,
  },
  checkboxDescription: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: spacings.xl,
  },
  footer: {
    padding: spacings.screenPadding,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
