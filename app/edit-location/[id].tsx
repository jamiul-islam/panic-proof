import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
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
      <Stack.Screen options={{ title: "Edit Location" }} />
      
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
    padding: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  addressInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    minHeight: 44,
    textAlignVertical: 'top',
  },
  locationTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  locationTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 80,
  },
  selectedLocationType: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  locationTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
  },
  selectedLocationTypeText: {
    color: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkedCheckbox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabelContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  checkboxDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});
