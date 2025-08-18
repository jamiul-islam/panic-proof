import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useUserStore } from '@/store/user-store';
import { EmergencyContact } from '@/types';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import { Plus, Search, X, UserPlus } from 'lucide-react-native';
import EmergencyContactCard from '@/components/EmergencyContactCard';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';

export default function EmergencyContactsScreen() {
  const router = useRouter();
  const { profile, removeEmergencyContact } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const contacts = profile?.emergencyContacts || [];
  
  const filteredContacts = searchQuery
    ? contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.relationship.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contacts;
  
  const handleAddContact = () => {
    router.push('/add-contact');
  };
  
  const handleEditContact = (contactId: string) => {
    router.push(`/edit-contact/${contactId}`);
  };
  
  const handleDeleteContact = (contactId: string) => {
    removeEmergencyContact(contactId);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: "Emergency Contacts",
          headerBackTitle: "",
          headerRight: () => (
            <TouchableOpacity onPress={handleAddContact}>
              <Plus size={spacings.sectionSpacing} color={colors.text} style={{ marginRight: spacings.screenPadding }} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {contacts.length > 0 && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={spacings.xl} color={colors.textTertiary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search contacts..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={colors.textTertiary}
              />
              {searchQuery.length > 0 && (
                <X
                  size={spacings.xl}
                  color={colors.textTertiary}
                  style={styles.clearIcon}
                  onPress={clearSearch}
                />
              )}
            </View>
          </View>
        )}
        
        {contacts.length > 0 ? (
          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EmergencyContactCard 
                contact={item} 
                onEdit={() => handleEditContact(item.id)}
                onDelete={() => handleDeleteContact(item.id)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <EmptyState
              title="No Emergency Contacts"
              message="Add emergency contacts to quickly reach out to your loved ones during emergencies."
              icon={<UserPlus size={spacings.xxxxl + spacings.sm} color={colors.textTertiary} />}
            />
            <Button
              title="Add Contact"
              onPress={handleAddContact}
              variant="primary"
              icon={<Plus size={spacings.xl} color={colors.textInverse} />}
              iconPosition="left"
              style={styles.addButton}
            />
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: spacings.screenPadding,
    backgroundColor: colors.card,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: spacings.borderRadius.sm,
    paddingHorizontal: spacings.md,
  },
  searchIcon: {
    marginRight: spacings.sm,
  },
  searchInput: {
    flex: 1,
    height: spacings.heights.input,
    fontSize: spacings.fontSize.md,
    color: colors.text,
  },
  clearIcon: {
    padding: spacings.xs,
  },
  listContent: {
    padding: spacings.screenPadding,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacings.screenPadding,
  },
  addButton: {
    marginTop: spacings.sectionSpacing,
    width: '80%',
  },
});