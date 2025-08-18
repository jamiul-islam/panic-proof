import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useUserStore } from '@/store/user-store';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import Button from '@/components/Button';

export default function AddContactScreen() {
  const router = useRouter();
  const { addEmergencyContact } = useUserStore();
  
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isLocal, setIsLocal] = useState(false);
  
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const validateForm = () => {
    let isValid = true;
    
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else {
      setPhoneError('');
    }
    
    return isValid;
  };
  
  const handleSave = () => {
    if (!validateForm()) return;
    
    const newContact = {
      id: Date.now().toString(),
      name,
      relationship,
      phone,
      email: email || undefined,
      isLocal,
    };
    
    addEmergencyContact(newContact);
    router.back();
  };
  
  return (
    <>
      <Stack.Screen options={{ 
        title: "Add Emergency Contact",
        headerBackTitle: "",
      }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={[styles.input, nameError ? styles.inputError : null]}
                value={name}
                onChangeText={setName}
                placeholder="Enter contact name"
                placeholderTextColor={colors.textTertiary}
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Relationship</Text>
              <TextInput
                style={styles.input}
                value={relationship}
                onChangeText={setRelationship}
                placeholder="E.g., Family, Friend, Neighbor"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={[styles.input, phoneError ? styles.inputError : null]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor={colors.textTertiary}
                keyboardType="phone-pad"
              />
              {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email (Optional)</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email address"
                placeholderTextColor={colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.switchContainer}>
              <View>
                <Text style={styles.label}>Local Contact</Text>
                <Text style={styles.switchDescription}>
                  This person lives nearby and can help during emergencies
                </Text>
              </View>
              <Switch
                value={isLocal}
                onValueChange={setIsLocal}
                trackColor={{ false: colors.backgroundTertiary, true: colors.primary }}
                thumbColor={colors.textInverse}
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
              title="Save Contact"
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
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: spacings.fontSize.sm,
    marginTop: spacings.xs,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacings.screenPadding,
  },
  switchDescription: {
    fontSize: spacings.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacings.xs,
    maxWidth: '80%',
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