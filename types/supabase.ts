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
          description: string
          expires_at: string | null
          id: string
          instructions: Json | null
          is_active: boolean | null
          level: string | null
          location: string
          source: string
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          expires_at?: string | null
          id?: string
          instructions?: Json | null
          is_active?: boolean | null
          level?: string | null
          location: string
          source: string
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          instructions?: Json | null
          is_active?: boolean | null
          level?: string | null
          location?: string
          source?: string
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      checklist_items: {
        Row: {
          checklist_id: string | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          order_index: number | null
          text: string
          updated_at: string | null
        }
        Insert: {
          checklist_id?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          order_index?: number | null
          text: string
          updated_at?: string | null
        }
        Update: {
          checklist_id?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          order_index?: number | null
          text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "custom_checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_checklists: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_completed: boolean | null
          points: number | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_completed?: boolean | null
          points?: number | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_completed?: boolean | null
          points?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_checklists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      disaster_info: {
        Row: {
          after_disaster_tips: string[] | null
          color_scheme: string
          created_at: string | null
          description: string
          during_disaster_tips: string[] | null
          evacuation_info: string | null
          icon_name: string
          id: string
          preparation_tips: string[] | null
          severity_levels: Json | null
          supply_list: string[] | null
          title: string
          type: string
          updated_at: string | null
          warning_signs: string[] | null
        }
        Insert: {
          after_disaster_tips?: string[] | null
          color_scheme: string
          created_at?: string | null
          description: string
          during_disaster_tips?: string[] | null
          evacuation_info?: string | null
          icon_name: string
          id?: string
          preparation_tips?: string[] | null
          severity_levels?: Json | null
          supply_list?: string[] | null
          title: string
          type: string
          updated_at?: string | null
          warning_signs?: string[] | null
        }
        Update: {
          after_disaster_tips?: string[] | null
          color_scheme?: string
          created_at?: string | null
          description?: string
          during_disaster_tips?: string[] | null
          evacuation_info?: string | null
          icon_name?: string
          id?: string
          preparation_tips?: string[] | null
          severity_levels?: Json | null
          supply_list?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
          warning_signs?: string[] | null
        }
        Relationships: []
      }
      disaster_info_resources: {
        Row: {
          disaster_type: string
          resource_id: string
        }
        Insert: {
          disaster_type: string
          resource_id: string
        }
        Update: {
          disaster_type?: string
          resource_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "disaster_info_resources_disaster_type_fkey"
            columns: ["disaster_type"]
            isOneToOne: false
            referencedRelation: "disaster_info"
            referencedColumns: ["type"]
          },
          {
            foreignKeyName: "disaster_info_resources_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_contacts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_local: boolean | null
          name: string
          phone: string
          relationship: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_local?: boolean | null
          name: string
          phone: string
          relationship: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_local?: boolean | null
          name?: string
          phone?: string
          relationship?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      kit_items: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          is_acquired: boolean | null
          name: string
          quantity: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_acquired?: boolean | null
          name: string
          quantity?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_acquired?: boolean | null
          name?: string
          quantity?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kit_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          category: string | null
          content_url: string | null
          created_at: string | null
          description: string
          difficulty_level: string | null
          duration_minutes: number | null
          id: string
          is_featured: boolean | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content_url?: string | null
          created_at?: string | null
          description: string
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          is_featured?: boolean | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content_url?: string | null
          created_at?: string | null
          description?: string
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          is_featured?: boolean | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_locations: {
        Row: {
          address: string
          created_at: string | null
          id: string
          is_primary: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          disaster_types: Json | null
          id: string
          image_url: string | null
          is_active: boolean | null
          points: number | null
          steps: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          disaster_types?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          points?: number | null
          steps?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          disaster_types?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          points?: number | null
          steps?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_alert_views: {
        Row: {
          alert_id: string | null
          id: string
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          alert_id?: string | null
          id?: string
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          alert_id?: string | null
          id?: string
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_alert_views_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_alert_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_resource_progress: {
        Row: {
          id: string
          is_completed: boolean | null
          last_accessed_at: string | null
          progress_percent: number | null
          resource_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          is_completed?: boolean | null
          last_accessed_at?: string | null
          progress_percent?: number | null
          resource_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          is_completed?: boolean | null
          last_accessed_at?: string | null
          progress_percent?: number | null
          resource_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_resource_progress_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_resource_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_task_completions: {
        Row: {
          completed_at: string | null
          id: string
          task_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          task_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          task_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_task_completions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_task_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          clerk_user_id: string
          created_at: string | null
          has_children: boolean | null
          has_disabled: boolean | null
          has_elderly: boolean | null
          has_pets: boolean | null
          household_size: number | null
          id: string
          level: number | null
          location: string | null
          medical_conditions: Json | null
          name: string
          notification_preferences: Json | null
          points: number | null
          profile_image: string | null
          updated_at: string | null
        }
        Insert: {
          clerk_user_id: string
          created_at?: string | null
          has_children?: boolean | null
          has_disabled?: boolean | null
          has_elderly?: boolean | null
          has_pets?: boolean | null
          household_size?: number | null
          id?: string
          level?: number | null
          location?: string | null
          medical_conditions?: Json | null
          name: string
          notification_preferences?: Json | null
          points?: number | null
          profile_image?: string | null
          updated_at?: string | null
        }
        Update: {
          clerk_user_id?: string
          created_at?: string | null
          has_children?: boolean | null
          has_disabled?: boolean | null
          has_elderly?: boolean | null
          has_pets?: boolean | null
          household_size?: number | null
          id?: string
          level?: number | null
          location?: string | null
          medical_conditions?: Json | null
          name?: string
          notification_preferences?: Json | null
          points?: number | null
          profile_image?: string | null
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

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
