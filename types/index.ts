export type DisasterType = 
  | "flood" 
  | "earthquake" 
  | "wildfire" 
  | "hurricane" 
  | "tornado" 
  | "tsunami" 
  | "winter_storm" 
  | "extreme_heat" 
  | "pandemic";

export type AlertLevel = "low" | "medium" | "high" | "critical";

export interface Alert {
  id: string;
  type: DisasterType;
  title: string;
  description: string;
  level: AlertLevel;
  location: string;
  date: string;
  isActive: boolean;
  source: string;
  instructions?: string[];
}

export interface PrepTask {
  id: string;
  title: string;
  description: string;
  points: number;
  isCompleted: boolean;
  category: "supplies" | "planning" | "skills" | "home";
  disasterTypes: DisasterType[];
  steps?: string[];
  imageUrl?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: "emergency" | "medical" | "shelter" | "food" | "utilities" | "transportation" | "information";
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  disasterTypes: DisasterType[];
}

export interface UserProfile {
  id: string;
  name: string;
  location: string;
  householdSize: number;
  hasPets: boolean;
  hasChildren: boolean;
  hasElderly: boolean;
  hasDisabled: boolean;
  medicalConditions: string[];
  emergencyContacts: EmergencyContact[];
  completedTasks: string[];
  points: number;
  level: number;
  badges: Badge[];
  customKit: KitItem[];
  profileImage?: string;
  savedLocations?: SavedLocation[];
  notificationPreferences?: NotificationPreferences;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isLocal: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  dateEarned: string;
}

export interface KitItem {
  id: string;
  name: string;
  quantity: number;
  isAcquired: boolean;
  category: "food" | "water" | "medical" | "tools" | "documents" | "clothing" | "hygiene" | "other";
}

export interface DisasterInfo {
  type: DisasterType;
  name: string;
  description: string;
  category: "natural" | "weather" | "geological" | "human-made" | "biological";
  beforeTips: string[];
  duringTips: string[];
  afterTips: string[];
  iconName: string;
  imageUrl: string;
}

export interface SavedLocation {
  id: string;
  name: string;
  address: string;
  type: "home" | "work" | "favorite" | "other";
  isPrimary: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface NotificationPreferences {
  alertNotifications: boolean;
  taskReminders: boolean;
  weatherUpdates: boolean;
  newsUpdates: boolean;
  locationAlerts: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
}