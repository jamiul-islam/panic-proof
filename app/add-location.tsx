import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
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
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <View style={styles.addressInputContainer}>
                <IconWrapper icon={Search} size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                  style={styles.addressInput}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Search for an address"
                  placeholderTextColor="#9CA3AF"
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
                    size={20} 
                    color={locationType === 'home' ? '#fff' : colors.text} 
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
                    size={20} 
                    color={locationType === 'work' ? '#fff' : colors.text} 
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
                    size={20} 
                    color={locationType === 'favorite' ? '#fff' : colors.text} 
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
                    size={20} 
                    color={locationType === 'other' ? '#fff' : colors.text} 
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
            <IconWrapper icon={MapPin} size={32} color="#9CA3AF" />
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
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  addressInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: colors.text,
  },
  locationTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  locationTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedLocationType: {
    backgroundColor: colors.primary,
  },
  locationTypeText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 4,
  },
  selectedLocationTypeText: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: colors.text,
  },
  switchButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    padding: 2,
  },
  switchButtonActive: {
    backgroundColor: colors.primary,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  switchThumbActive: {
    transform: [{ translateX: 22 }],
  },
  mapPlaceholder: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 32,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});