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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          id: string
          location: string | null
          method: string | null
          office_id: string | null
          photo_url: string | null
          timestamp_utc: string
          user_id: string
        }
        Insert: {
          id?: string
          location?: string | null
          method?: string | null
          office_id?: string | null
          photo_url?: string | null
          timestamp_utc?: string
          user_id: string
        }
        Update: {
          id?: string
          location?: string | null
          method?: string | null
          office_id?: string | null
          photo_url?: string | null
          timestamp_utc?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          details: Json | null
          id: string
          target: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action: string
          details?: Json | null
          id?: string
          target?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          details?: Json | null
          id?: string
          target?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      code_posts: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          last_update_at: string
          last_update_by: string | null
          status: Database["public"]["Enums"]["post_status"]
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          last_update_at?: string
          last_update_by?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          last_update_at?: string
          last_update_by?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          attachment_url: string | null
          id: string
          post_id: string
          text: string
          timestamp: string
          user_id: string
        }
        Insert: {
          attachment_url?: string | null
          id?: string
          post_id: string
          text: string
          timestamp?: string
          user_id: string
        }
        Update: {
          attachment_url?: string | null
          id?: string
          post_id?: string
          text?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "code_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          amount: number
          calculated_at: string
          commission_percent: number
          id: string
          paid_status: boolean
          product: string
          sale_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          calculated_at?: string
          commission_percent: number
          id?: string
          paid_status?: boolean
          product: string
          sale_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          calculated_at?: string
          commission_percent?: number
          id?: string
          paid_status?: boolean
          product?: string
          sale_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          captured_at: string
          captured_by: string
          follow_up_date: string | null
          id: string
          image_url: string | null
          name: string
          notes: string | null
          phone: string
          product_interest: string | null
          shop_name: string | null
          status: Database["public"]["Enums"]["lead_status"]
        }
        Insert: {
          captured_at?: string
          captured_by: string
          follow_up_date?: string | null
          id?: string
          image_url?: string | null
          name: string
          notes?: string | null
          phone: string
          product_interest?: string | null
          shop_name?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
        }
        Update: {
          captured_at?: string
          captured_by?: string
          follow_up_date?: string | null
          id?: string
          image_url?: string | null
          name?: string
          notes?: string | null
          phone?: string
          product_interest?: string | null
          shop_name?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active: boolean
          id: string
          joined_at: string
          name: string
          phone: string | null
          user_id: string
        }
        Insert: {
          active?: boolean
          id?: string
          joined_at?: string
          name: string
          phone?: string | null
          user_id: string
        }
        Update: {
          active?: boolean
          id?: string
          joined_at?: string
          name?: string
          phone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          address: string | null
          assigned_to: string | null
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          scheduled_date: string | null
          shop_name: string | null
          status: Database["public"]["Enums"]["task_status"]
          task_type: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          scheduled_date?: string | null
          shop_name?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          task_type: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          scheduled_date?: string | null
          shop_name?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          task_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      uploads: {
        Row: {
          description: string | null
          file_name: string
          file_url: string
          id: string
          linked_task_id: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          description?: string | null
          file_name: string
          file_url: string
          id?: string
          linked_task_id?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          description?: string | null
          file_name?: string
          file_url?: string
          id?: string
          linked_task_id?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploads_linked_task_id_fkey"
            columns: ["linked_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "marketing_manager" | "coder"
      lead_status: "new" | "contacted" | "qualified" | "converted" | "lost"
      post_status: "open" | "in_progress" | "resolved" | "closed"
      task_status: "pending" | "in_progress" | "completed" | "cancelled"
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
    Enums: {
      app_role: ["admin", "marketing_manager", "coder"],
      lead_status: ["new", "contacted", "qualified", "converted", "lost"],
      post_status: ["open", "in_progress", "resolved", "closed"],
      task_status: ["pending", "in_progress", "completed", "cancelled"],
    },
  },
} as const
