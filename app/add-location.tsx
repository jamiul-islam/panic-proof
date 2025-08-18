import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import { MapPin, Home, Briefcase, Heart, Search } from 'lucide-react-native';
import Button from '@/components/Button';
import IconWrapper from '@/components/IconWrapper';
import { useUserStore } from '@/store/user-store';

export default function AddLocationScreen() {
  const router = useRouter();
  const { addSavedLocation } = useUserStore();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [locationType, setLocationType] = useState('home');
  const [isPrimary, setIsPrimary] = useState(false);
  
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

    // Create the new location object
    const newLocation = {
      id: Date.now().toString(), // Simple ID generation
      name: name.trim(),
      address: address.trim(),
      type: locationType as "home" | "work" | "favorite" | "other",
      isPrimary
    };

    // Save to store
    addSavedLocation(newLocation);

    // Show success message and go back
    Alert.alert(
      "Location Saved",
      "Your location has been successfully saved.",
      [{ 
        text: "OK", 
        onPress: () => router.back() 
      }]
    );
  };
  
  return (
    <>
      <Stack.Screen options={{ 
        title: "Add Location",
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
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Set as Primary Location</Text>
              <TouchableOpacity
                style={[
                  styles.switchButton,
                  isPrimary && styles.switchButtonActive,
                ]}
                onPress={() => setIsPrimary(!isPrimary)}
              >
                <View 
                  style={[
                    styles.switchThumb,
                    isPrimary && styles.switchThumbActive,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.mapPlaceholder}>
            <IconWrapper icon={MapPin} size={spacings.xxxl} color={colors.textTertiary} />
            <Text style={styles.mapPlaceholderText}>Map View</Text>
            <Text style={styles.mapPlaceholderSubtext}>
              In a real app, a map would be displayed here to select a location.
            </Text>
          </View>
          
          <View style={styles.buttonsContainer}>
            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="outline"
              style={styles.button}
            />
            <Button
              title="Save Location"
              onPress={handleSave}
              variant="primary"
              style={styles.button}
              disabled={!name || !address}
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
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacings.borderRadius.sm,
    paddingHorizontal: spacings.md,
  },
  searchIcon: {
    marginRight: spacings.sm,
  },
  addressInput: {
    flex: 1,
    height: spacings.heights.input,
    fontSize: spacings.fontSize.md,
    color: colors.text,
  },
  locationTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacings.sm,
  },
  locationTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: spacings.sm,
    paddingHorizontal: spacings.md,
    borderRadius: spacings.borderRadius.sm,
    marginRight: spacings.sm,
    marginBottom: spacings.sm,
  },
  selectedLocationType: {
    backgroundColor: colors.primary,
  },
  locationTypeText: {
    fontSize: spacings.fontSize.sm,
    color: colors.text,
    marginLeft: spacings.xs,
  },
  selectedLocationTypeText: {
    color: colors.textInverse,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacings.sm,
  },
  switchLabel: {
    fontSize: spacings.fontSize.md,
    color: colors.text,
  },
  switchButton: {
    width: spacings.xxxxxl + spacings.xs,
    height: spacings.xxl + spacings.xs,
    borderRadius: (spacings.xxl + spacings.xs) / 2,
    backgroundColor: colors.backgroundTertiary,
    padding: spacings.xs / 2,
  },
  switchButtonActive: {
    backgroundColor: colors.primary,
  },
  switchThumb: {
    width: spacings.sectionSpacing,
    height: spacings.sectionSpacing,
    borderRadius: spacings.borderRadius.md,
    backgroundColor: colors.card,
  },
  switchThumbActive: {
    transform: [{ translateX: spacings.xl + spacings.xs / 2 }],
  },
  mapPlaceholder: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: spacings.borderRadius.md,
    height: spacings.xxxxl * 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacings.screenPadding,
  },
  mapPlaceholderText: {
    fontSize: spacings.fontSize.md,
    fontWeight: '500',
    color: colors.textTertiary,
    marginTop: spacings.sm,
  },
  mapPlaceholderSubtext: {
    fontSize: spacings.fontSize.sm,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacings.xs,
    paddingHorizontal: spacings.xxxl,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacings.sectionSpacing,
  },
  button: {
    flex: 1,
    marginHorizontal: spacings.xs,
  },
});