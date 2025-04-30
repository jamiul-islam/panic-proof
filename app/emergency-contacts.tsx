import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useUserStore } from '@/store/user-store';
import { EmergencyContact } from '@/types';
import { colors } from '@/constants/colors';
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
          headerRight: () => (
            <TouchableOpacity onPress={handleAddContact}>
              <Plus size={24} color="#000" style={{ marginRight: 16 }} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {contacts.length > 0 && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search contacts..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
              {searchQuery.length > 0 && (
                <X
                  size={20}
                  color="#9CA3AF"
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
              icon={<UserPlus size={48} color="#9CA3AF" />}
            />
            <Button
              title="Add Contact"
              onPress={handleAddContact}
              variant="primary"
              icon={<Plus size={20} color="#fff" />}
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
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: colors.text,
  },
  clearIcon: {
    padding: 4,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  addButton: {
    marginTop: 24,
    width: '80%',
  },
});