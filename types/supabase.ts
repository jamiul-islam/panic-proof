export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string | null
          date: string
          description: string
          id: string
          instructions: Json | null
          is_active: boolean | null
          level: string
          location: string
          source: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          description: string
          id?: string
          instructions?: Json | null
          is_active?: boolean | null
          level: string
          location: string
          source: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          instructions?: Json | null
          is_active?: boolean | null
          level?: string
          location?: string
          source?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          address: string | null
          category: string
          contact_email: string | null
          contact_phone: string | null
          coordinates: Json | null
          created_at: string | null
          description: string
          disaster_types: Json
          id: string
          title: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          category: string
          contact_email?: string | null
          contact_phone?: string | null
          coordinates?: Json | null
          created_at?: string | null
          description: string
          disaster_types: Json
          id?: string
          title: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          contact_email?: string | null
          contact_phone?: string | null
          coordinates?: Json | null
          created_at?: string | null
          description?: string
          disaster_types?: Json
          id?: string
          title?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          clerk_user_id: string
          created_at: string | null
          email: string
          has_children: boolean | null
          has_disabled: boolean | null
          has_elderly: boolean | null
          has_pets: boolean | null
          household_size: number | null
          id: string
          location: string | null
          medical_conditions: Json | null
          name: string
          notification_preferences: Json | null
          updated_at: string | null
        }
        Insert: {
          clerk_user_id: string
          created_at?: string | null
          email: string
          has_children?: boolean | null
          has_disabled?: boolean | null
          has_elderly?: boolean | null
          has_pets?: boolean | null
          household_size?: number | null
          id?: string
          location?: string | null
          medical_conditions?: Json | null
          name: string
          notification_preferences?: Json | null
          updated_at?: string | null
        }
        Update: {
          clerk_user_id?: string
          created_at?: string | null
          email?: string
          has_children?: boolean | null
          has_disabled?: boolean | null
          has_elderly?: boolean | null
          has_pets?: boolean | null
          household_size?: number | null
          id?: string
          location?: string | null
          medical_conditions?: Json | null
          name?: string
          notification_preferences?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

// Helper types for easier access to our specific tables
export type AlertRow = Tables<'alerts'>;
export type ResourceRow = Tables<'resources'>;
export type UserProfile = Tables<'users'>;

// OnboardingData interface for user creation
export interface OnboardingData {
  name: string;
  location: string;
  household_size: number;
  has_pets: boolean;
  has_children: boolean;
  has_elderly: boolean;
  has_disabled: boolean;
  medical_conditions: string[];
  notification_preferences: {
    alerts: boolean;
    reminders: boolean;
    weather: boolean;
    emergency: boolean;
  };
}