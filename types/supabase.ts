export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account: {
        Row: {
          account_id: string
          account_status: Database["public"]["Enums"]["accountStatus"] | null
          first_name: string
          last_name: string
          middle_name: string | null
          profile_picture: string | null
          user_id: string
        }
        Insert: {
          account_id?: string
          account_status?: Database["public"]["Enums"]["accountStatus"] | null
          first_name?: string
          last_name?: string
          middle_name?: string | null
          profile_picture?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          account_status?: Database["public"]["Enums"]["accountStatus"] | null
          first_name?: string
          last_name?: string
          middle_name?: string | null
          profile_picture?: string | null
          user_id?: string
        }
        Relationships: []
      }
      account_status: {
        Row: {
          account_status_id: string
          status: Database["public"]["Enums"]["accountStatus"]
        }
        Insert: {
          account_status_id?: string
          status?: Database["public"]["Enums"]["accountStatus"]
        }
        Update: {
          account_status_id?: string
          status?: Database["public"]["Enums"]["accountStatus"]
        }
        Relationships: []
      }
      active_listings: {
        Row: {
          active_listing_id: string
          listing_date_active: string
          listing_id: string | null
        }
        Insert: {
          active_listing_id?: string
          listing_date_active: string
          listing_id?: string | null
        }
        Update: {
          active_listing_id?: string
          listing_date_active?: string
          listing_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "active_listings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["listing_id"]
          },
        ]
      }
      archived_listings: {
        Row: {
          archived_listing_id: string
          archived_status: string
          created_at: string
          listing_id: string
        }
        Insert: {
          archived_listing_id?: string
          archived_status: string
          created_at?: string
          listing_id: string
        }
        Update: {
          archived_listing_id?: string
          archived_status?: string
          created_at?: string
          listing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "archived_listings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["listing_id"]
          },
        ]
      }
      draft_listings: {
        Row: {
          broker_account_id: string | null
          created_at: string
          draft_listing_id: string
          property_id: string | null
        }
        Insert: {
          broker_account_id?: string | null
          created_at?: string
          draft_listing_id?: string
          property_id?: string | null
        }
        Update: {
          broker_account_id?: string | null
          created_at?: string
          draft_listing_id?: string
          property_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "draft_listings_broker_account_id_fkey"
            columns: ["broker_account_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "draft_listings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["property_id"]
          },
        ]
      }
      listings: {
        Row: {
          account_id: string | null
          created_at: string
          listed_date: string | null
          listing_id: string
          property_id: string | null
        }
        Insert: {
          account_id?: string | null
          created_at?: string
          listed_date?: string | null
          listing_id?: string
          property_id?: string | null
        }
        Update: {
          account_id?: string | null
          created_at?: string
          listed_date?: string | null
          listing_id?: string
          property_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "listings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["property_id"]
          },
        ]
      }
      notes: {
        Row: {
          id: number
          title: string | null
        }
        Insert: {
          id?: number
          title?: string | null
        }
        Update: {
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      pending_user: {
        Row: {
          created_at: string
          first_name: string
          last_name: string
          middle_name: string | null
          pending_user_id: string
          profile_picture: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          first_name: string
          last_name: string
          middle_name?: string | null
          pending_user_id?: string
          profile_picture?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          first_name?: string
          last_name?: string
          middle_name?: string | null
          pending_user_id?: string
          profile_picture?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          amount: number
          date_funded: string | null
          id: number
          img_urls: string | null
          interest_rate: number
          lat_long: string | null
          list_date: string
          ltv: number
          market_value: number | null
          maturity_date: string | null
          mortgage_type: number | null
          prior_e: string | null
          property_type: string
          region: string
          term: number | null
        }
        Insert: {
          address: string
          amount: number
          date_funded?: string | null
          id?: number
          img_urls?: string | null
          interest_rate: number
          lat_long?: string | null
          list_date: string
          ltv: number
          market_value?: number | null
          maturity_date?: string | null
          mortgage_type?: number | null
          prior_e?: string | null
          property_type: string
          region: string
          term?: number | null
        }
        Update: {
          address?: string
          amount?: number
          date_funded?: string | null
          id?: number
          img_urls?: string | null
          interest_rate?: number
          lat_long?: string | null
          list_date?: string
          ltv?: number
          market_value?: number | null
          maturity_date?: string | null
          mortgage_type?: number | null
          prior_e?: string | null
          property_type?: string
          region?: string
          term?: number | null
        }
        Relationships: []
      }
      property: {
        Row: {
          address: Json
          amount: number
          created_at: string
          date_funded: string
          estimated_fair_market_value: number
          imgs: string
          interest_rate: number
          ltv: number
          mortgage_type: string
          prior_encumbrances: Json
          private_docs: string
          property_id: string
          property_type: string
          region: string
          summary: string
          term: Json
        }
        Insert: {
          address: Json
          amount?: number
          created_at?: string
          date_funded: string
          estimated_fair_market_value: number
          imgs?: string
          interest_rate: number
          ltv?: number
          mortgage_type?: string
          prior_encumbrances: Json
          private_docs?: string
          property_id?: string
          property_type?: string
          region?: string
          summary: string
          term: Json
        }
        Update: {
          address?: Json
          amount?: number
          created_at?: string
          date_funded?: string
          estimated_fair_market_value?: number
          imgs?: string
          interest_rate?: number
          ltv?: number
          mortgage_type?: string
          prior_encumbrances?: Json
          private_docs?: string
          property_id?: string
          property_type?: string
          region?: string
          summary?: string
          term?: Json
        }
        Relationships: []
      }
      roles: {
        Row: {
          id: number
          role_name: string
        }
        Insert: {
          id?: never
          role_name: string
        }
        Update: {
          id?: never
          role_name?: string
        }
        Relationships: []
      }
      saved_properties: {
        Row: {
          account_id: string
          active_listing_id: string
          created_at: string
          saved_properties_id: string
        }
        Insert: {
          account_id: string
          active_listing_id: string
          created_at?: string
          saved_properties_id?: string
        }
        Update: {
          account_id?: string
          active_listing_id?: string
          created_at?: string
          saved_properties_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_properties_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "saved_properties_active_listing_id_fkey"
            columns: ["active_listing_id"]
            isOneToOne: false
            referencedRelation: "active_listings"
            referencedColumns: ["active_listing_id"]
          },
        ]
      }
      sold_listings: {
        Row: {
          buyer_account_id: string
          created_at: string
          finalized: boolean
          listing_id: string
          sold_listings_id: string
        }
        Insert: {
          buyer_account_id: string
          created_at?: string
          finalized: boolean
          listing_id: string
          sold_listings_id?: string
        }
        Update: {
          buyer_account_id?: string
          created_at?: string
          finalized?: boolean
          listing_id?: string
          sold_listings_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sold_listings_buyer_account_id_fkey"
            columns: ["buyer_account_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "sold_listings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["listing_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: number
          role_id: number
          user_id: string
        }
        Insert: {
          id?: never
          role_id: number
          user_id: string
        }
        Update: {
          id?: never
          role_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      accountStatus:
        | "ACTIVE"
        | "PENDING"
        | "ARCHIVED"
        | "SUSPENDED"
        | "UNVERIFIED"
      user_role_type:
        | "ADMIN"
        | "BROKER"
        | "INVESTOR"
        | "BORROWER"
        | "SUPERADMIN"
        | "PENDING"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
