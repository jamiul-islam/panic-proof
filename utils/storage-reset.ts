import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Clear all Zustand persisted storage
 * Call this when you need to reset all stores due to migration issues
 */
export async function clearAllPersistedStores() {
  try {
    const storageKeys = [
      'auth-storage',
      'user-storage',
      'chat-store',
      'tasks-storage',
      'alerts-storage'
    ];
    
    await Promise.all(storageKeys.map(key => AsyncStorage.removeItem(key)));
    
    console.log('✅ All persisted stores cleared successfully');
    return true;
  } catch (error) {
    console.error('❌ Error clearing persisted stores:', error);
    return false;
  }
}

/**
 * Clear all AsyncStorage (nuclear option)
 * Use with caution - this clears everything
 */
export async function clearAllAsyncStorage() {
  try {
    await AsyncStorage.clear();
    console.log('✅ All AsyncStorage cleared successfully');
    return true;
  } catch (error) {
    console.error('❌ Error clearing AsyncStorage:', error);
    return false;
  }
}
