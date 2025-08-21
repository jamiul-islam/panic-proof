/**
 * Test script for Emergency Contacts and Saved Locations CRUD operations
 * This script demonstrates how to use the new Supabase-integrated methods
 */

import { useUserStore } from '../store/user-store';
import { EmergencyContact, SavedLocation } from '../types';

// Example usage of the new CRUD methods
export async function testEmergencyContactsCRUD(clerkUserId: string) {
  console.log('🧪 Testing Emergency Contacts CRUD operations...');
  
  const userStore = useUserStore.getState();
  
  try {
    // First load user profile
    await userStore.loadUserProfile(clerkUserId);
    
    // 1. Add Emergency Contact
    console.log('➕ Adding emergency contact...');
    const newContact: Omit<EmergencyContact, 'id'> = {
      name: 'John Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      relationship: 'Spouse',
      isLocal: false,
    };
    
    await userStore.addEmergencyContact(newContact);
    console.log('✅ Contact added successfully');
    
    // 2. Load all contacts
    console.log('📋 Loading emergency contacts...');
    await userStore.loadEmergencyContacts();
    const contacts = userStore.profile?.emergencyContacts || [];
    console.log(`✅ Loaded ${contacts.length} contacts`);
    
    // 3. Update a contact (if we have any)
    if (contacts.length > 0) {
      const contactToUpdate = contacts[0];
      console.log('✏️ Updating first contact...');
      
      await userStore.updateEmergencyContact(
        contactToUpdate.id, 
        { phone: '+9876543210' }
      );
      console.log('✅ Contact updated successfully');
    }
    
    // 4. Delete a contact (if we have multiple)
    if (contacts.length > 1) {
      const contactToDelete = contacts[1];
      console.log('🗑️ Deleting second contact...');
      
      await userStore.removeEmergencyContact(contactToDelete.id);
      console.log('✅ Contact deleted successfully');
    }
    
    console.log('✅ Emergency Contacts CRUD test completed!');
    
  } catch (error) {
    console.error('❌ Emergency Contacts CRUD test failed:', error);
    throw error;
  }
}

export async function testSavedLocationsCRUD(clerkUserId: string) {
  console.log('🧪 Testing Saved Locations CRUD operations...');
  
  const userStore = useUserStore.getState();
  
  try {
    // First load user profile
    await userStore.loadUserProfile(clerkUserId);
    
    // 1. Add Saved Location
    console.log('➕ Adding saved location...');
    const newLocation: Omit<SavedLocation, 'id'> = {
      name: 'Emergency Shelter',
      address: '789 Safety Street, London, UK',
      type: 'other',
      isPrimary: false,
      coordinates: {
        latitude: 51.5074,
        longitude: -0.1278,
      },
    };
    
    await userStore.addSavedLocation(newLocation);
    console.log('✅ Location added successfully');
    
    // 2. Load all locations
    console.log('📋 Loading saved locations...');
    await userStore.loadSavedLocations();
    const locations = userStore.profile?.savedLocations || [];
    console.log(`✅ Loaded ${locations.length} locations`);
    
    // 3. Update a location (if we have any)
    if (locations.length > 0) {
      const locationToUpdate = locations[0];
      console.log('✏️ Updating first location...');
      
      await userStore.updateSavedLocation(
        locationToUpdate.id, 
        { name: 'Updated Location Name' }
      );
      console.log('✅ Location updated successfully');
    }
    
    // 4. Set primary location
    if (locations.length > 1) {
      const locationForPrimary = locations[1];
      console.log('⭐ Setting primary location...');
      
      await userStore.setPrimaryLocation(locationForPrimary.id);
      console.log('✅ Primary location set successfully');
    }
    
    // 5. Delete a location (if we have multiple)
    if (locations.length > 2) {
      const locationToDelete = locations[2];
      console.log('🗑️ Deleting third location...');
      
      await userStore.removeSavedLocation(locationToDelete.id);
      console.log('✅ Location deleted successfully');
    }
    
    console.log('✅ Saved Locations CRUD test completed!');
    
  } catch (error) {
    console.error('❌ Saved Locations CRUD test failed:', error);
    throw error;
  }
}

export async function runAllCRUDTests(clerkUserId: string) {
  console.log('🚀 Running all CRUD tests...');
  
  try {
    // Load user profile first
    const userStore = useUserStore.getState();
    await userStore.loadUserProfile(clerkUserId);
    
    // Test Emergency Contacts
    await testEmergencyContactsCRUD(clerkUserId);
    
    // Test Saved Locations
    await testSavedLocationsCRUD(clerkUserId);
    
    console.log('🎉 All CRUD tests completed successfully!');
    
  } catch (error) {
    console.error('💥 CRUD tests failed:', error);
  }
}

// Usage in your app:
// import { runAllCRUDTests } from './scripts/test-crud';
// runAllCRUDTests('your-clerk-user-id');
