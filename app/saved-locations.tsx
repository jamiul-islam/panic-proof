import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { MapPin, Home, Briefcase, Heart, Edit, Trash2, Plus } from 'lucide-react-native';
import IconWrapper from '@/components/IconWrapper';
import Button from '@/components/Button';

// Mock data for saved locations
const mockLocations = [
  {
    id: '1',
    name: 'Home',
    address: '123 Main Street, London, UK',
    type: 'home',
    isPrimary: true,
  },
  {
    id: '2',
    name: 'Work',
    address: '456 Business Avenue, London, UK',
    type: 'work',
    isPrimary: false,
  },
  {
    id: '3',
    name: 'Parents',
    address: '789 Family Road, Manchester, UK',
    type: 'favorite',
    isPrimary: false,
  },
];

export default function SavedLocationsScreen() {
  const router = useRouter();
  const [locations, setLocations] = useState(mockLocations);
  
  const handleAddLocation = () => {
    router.push('/add-location');
  };
  
  const handleEditLocation = (id: string) => {
    // In a real app, this would navigate to an edit location screen
    Alert.alert(
      "Edit Location",
      "This would navigate to an edit location screen in a real app.",
      [{ text: "OK" }]
    );
  };
  
  const handleDeleteLocation = (id: string) => {
    Alert.alert(
      "Delete Location",
      "Are you sure you want to delete this location?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setLocations(locations.filter(location => location.id !== id));
          }
        }
      ]
    );
  };
  
  const handleSetPrimary = (id: string) => {
    setLocations(locations.map(location => ({
      ...location,
      isPrimary: location.id === id
    })));
  };
  
  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <IconWrapper icon={Home} size={20} color="#fff" />;
      case 'work':
        return <IconWrapper icon={Briefcase} size={20} color="#fff" />;
      case 'favorite':
        return <IconWrapper icon={Heart} size={20} color="#fff" />;
      default:
        return <IconWrapper icon={MapPin} size={20} color="#fff" />;
    }
  };
  
  const getLocationColor = (type: string) => {
    switch (type) {
      case 'home':
        return colors.primary;
      case 'work':
        return colors.secondary;
      case 'favorite':
        return colors.danger;
      default:
        return colors.text;
    }
  };
  
  const renderLocationItem = ({ item }: { item: typeof mockLocations[0] }) => (
    <View style={styles.locationItem}>
      <View style={styles.locationHeader}>
        <View style={styles.locationLeft}>
          <View 
            style={[
              styles.locationIconContainer,
              { backgroundColor: getLocationColor(item.type) }
            ]}
          >
            {getLocationIcon(item.type)}
          </View>
          <View>
            <Text style={styles.locationName}>{item.name}</Text>
            <Text style={styles.locationAddress}>{item.address}</Text>
          </View>
        </View>
        
        <View style={styles.locationActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleEditLocation(item.id)}
          >
            <IconWrapper icon={Edit} size={18} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteLocation(item.id)}
          >
            <IconWrapper icon={Trash2} size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.locationFooter}>
        {item.isPrimary ? (
          <View style={styles.primaryBadge}>
            <Text style={styles.primaryText}>Primary Location</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.setPrimaryButton}
            onPress={() => handleSetPrimary(item.id)}
          >
            <Text style={styles.setPrimaryText}>Set as Primary</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
  
  return (
    <>
      <Stack.Screen options={{ title: "Saved Locations" }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Save locations to receive alerts and recommendations specific to those areas.
          </Text>
          
          <FlatList
            data={locations}
            renderItem={renderLocationItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          
          <Button
            title="Add New Location"
            onPress={handleAddLocation}
            variant="primary"
            icon={<IconWrapper icon={Plus} size={20} color="#fff" />}
            iconPosition="left"
            style={styles.addButton}
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
  content: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 22,
  },
  listContent: {
    paddingBottom: 16,
  },
  locationItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#6B7280',
  },
  locationActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  locationFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  primaryBadge: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  primaryText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  setPrimaryButton: {
    paddingVertical: 6,
  },
  setPrimaryText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  addButton: {
    marginTop: 8,
  },
});