export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          role: Database["public"]["Enums"]["user_role"];
          is_verified: boolean;
          is_banned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          is_verified?: boolean;
          is_banned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          is_verified?: boolean;
          is_banned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: { id: string; slug: string; name: string; description: string | null; sort_order: number; created_at: string };
        Insert: { id?: string; slug: string; name: string; description?: string | null; sort_order?: number; created_at?: string };
        Update: { id?: string; slug?: string; name?: string; description?: string | null; sort_order?: number; created_at?: string };
        Relationships: [];
      };
      listings: {
        Row: { id: string; seller_id: string; category_id: string | null; slug: string; title: string; description: string; price_cents: number; currency: string; delivery_time_days: number | null; status: Database["public"]["Enums"]["listing_status"]; created_at: string; updated_at: string };
        Insert: { id?: string; seller_id: string; category_id?: string | null; slug: string; title: string; description?: string; price_cents: number; currency?: string; delivery_time_days?: number | null; status?: Database["public"]["Enums"]["listing_status"]; created_at?: string; updated_at?: string };
        Update: { id?: string; seller_id?: string; category_id?: string | null; slug?: string; title?: string; description?: string; price_cents?: number; currency?: string; delivery_time_days?: number | null; status?: Database["public"]["Enums"]["listing_status"]; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      listing_images: {
        Row: { id: string; listing_id: string; storage_path: string; position: number; created_at: string };
        Insert: { id?: string; listing_id: string; storage_path: string; position?: number; created_at?: string };
        Update: { id?: string; listing_id?: string; storage_path?: string; position?: number; created_at?: string };
        Relationships: [];
      };
      favorites: {
        Row: { user_id: string; listing_id: string; created_at: string };
        Insert: { user_id: string; listing_id: string; created_at?: string };
        Update: { user_id?: string; listing_id?: string; created_at?: string };
        Relationships: [];
      };
      offers: {
        Row: { id: string; listing_id: string; buyer_id: string; seller_id: string; amount_cents: number; currency: string; message: string | null; status: Database["public"]["Enums"]["offer_status"]; created_at: string; updated_at: string };
        Insert: { id?: string; listing_id: string; buyer_id: string; seller_id: string; amount_cents: number; currency?: string; message?: string | null; status?: Database["public"]["Enums"]["offer_status"]; created_at?: string; updated_at?: string };
        Update: { id?: string; listing_id?: string; buyer_id?: string; seller_id?: string; amount_cents?: number; currency?: string; message?: string | null; status?: Database["public"]["Enums"]["offer_status"]; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      conversations: {
        Row: { id: string; listing_id: string | null; buyer_id: string; seller_id: string; created_at: string; last_message_at: string };
        Insert: { id?: string; listing_id?: string | null; buyer_id: string; seller_id: string; created_at?: string; last_message_at?: string };
        Update: { id?: string; listing_id?: string | null; buyer_id?: string; seller_id?: string; created_at?: string; last_message_at?: string };
        Relationships: [];
      };
      messages: {
        Row: { id: string; conversation_id: string; sender_id: string; body: string; read_at: string | null; created_at: string };
        Insert: { id?: string; conversation_id: string; sender_id: string; body: string; read_at?: string | null; created_at?: string };
        Update: { id?: string; conversation_id?: string; sender_id?: string; body?: string; read_at?: string | null; created_at?: string };
        Relationships: [];
      };
      orders: {
        Row: { id: string; listing_id: string; offer_id: string | null; buyer_id: string; seller_id: string; amount_cents: number; currency: string; payment_method: string | null; status: Database["public"]["Enums"]["order_status"]; created_at: string; updated_at: string; completed_at: string | null };
        Insert: { id?: string; listing_id: string; offer_id?: string | null; buyer_id: string; seller_id: string; amount_cents: number; currency?: string; payment_method?: string | null; status?: Database["public"]["Enums"]["order_status"]; created_at?: string; updated_at?: string; completed_at?: string | null };
        Update: { id?: string; listing_id?: string; offer_id?: string | null; buyer_id?: string; seller_id?: string; amount_cents?: number; currency?: string; payment_method?: string | null; status?: Database["public"]["Enums"]["order_status"]; created_at?: string; updated_at?: string; completed_at?: string | null };
        Relationships: [];
      };
      order_events: {
        Row: { id: string; order_id: string; actor_id: string | null; event_type: Database["public"]["Enums"]["order_event_type"]; note: string | null; created_at: string };
        Insert: { id?: string; order_id: string; actor_id?: string | null; event_type: Database["public"]["Enums"]["order_event_type"]; note?: string | null; created_at?: string };
        Update: { id?: string; order_id?: string; actor_id?: string | null; event_type?: Database["public"]["Enums"]["order_event_type"]; note?: string | null; created_at?: string };
        Relationships: [];
      };
      disputes: {
        Row: { id: string; order_id: string; opened_by: string; reason: string; status: Database["public"]["Enums"]["dispute_status"]; resolution_note: string | null; resolved_by: string | null; created_at: string; resolved_at: string | null };
        Insert: { id?: string; order_id: string; opened_by: string; reason: string; status?: Database["public"]["Enums"]["dispute_status"]; resolution_note?: string | null; resolved_by?: string | null; created_at?: string; resolved_at?: string | null };
        Update: { id?: string; order_id?: string; opened_by?: string; reason?: string; status?: Database["public"]["Enums"]["dispute_status"]; resolution_note?: string | null; resolved_by?: string | null; created_at?: string; resolved_at?: string | null };
        Relationships: [];
      };
      reviews: {
        Row: { id: string; order_id: string; listing_id: string; reviewer_id: string; reviewee_id: string; rating: number; body: string | null; created_at: string };
        Insert: { id?: string; order_id: string; listing_id: string; reviewer_id: string; reviewee_id: string; rating: number; body?: string | null; created_at?: string };
        Update: { id?: string; order_id?: string; listing_id?: string; reviewer_id?: string; reviewee_id?: string; rating?: number; body?: string | null; created_at?: string };
        Relationships: [];
      };
      reports: {
        Row: { id: string; reporter_id: string; target_type: Database["public"]["Enums"]["report_target_type"]; target_id: string; reason: string; status: Database["public"]["Enums"]["report_status"]; handled_by: string | null; created_at: string; resolved_at: string | null };
        Insert: { id?: string; reporter_id: string; target_type: Database["public"]["Enums"]["report_target_type"]; target_id: string; reason: string; status?: Database["public"]["Enums"]["report_status"]; handled_by?: string | null; created_at?: string; resolved_at?: string | null };
        Update: { id?: string; reporter_id?: string; target_type?: Database["public"]["Enums"]["report_target_type"]; target_id?: string; reason?: string; status?: Database["public"]["Enums"]["report_status"]; handled_by?: string | null; created_at?: string; resolved_at?: string | null };
        Relationships: [];
      };
      notifications: {
        Row: { id: string; user_id: string; type: Database["public"]["Enums"]["notification_type"]; title: string; body: string | null; link: string | null; read_at: string | null; created_at: string };
        Insert: { id?: string; user_id: string; type: Database["public"]["Enums"]["notification_type"]; title: string; body?: string | null; link?: string | null; read_at?: string | null; created_at?: string };
        Update: { id?: string; user_id?: string; type?: Database["public"]["Enums"]["notification_type"]; title?: string; body?: string | null; link?: string | null; read_at?: string | null; created_at?: string };
        Relationships: [];
      };
      admin_actions: {
        Row: { id: string; admin_id: string; action: string; target_type: string | null; target_id: string | null; metadata: Json; created_at: string };
        Insert: { id?: string; admin_id: string; action: string; target_type?: string | null; target_id?: string | null; metadata?: Json; created_at?: string };
        Update: { id?: string; admin_id?: string; action?: string; target_type?: string | null; target_id?: string | null; metadata?: Json; created_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: "buyer_seller" | "moderator" | "admin";
      listing_status: "draft" | "active" | "paused" | "removed";
      offer_status: "pending" | "accepted" | "declined" | "withdrawn" | "expired";
      order_status: "pending_payment" | "paid" | "in_progress" | "delivered" | "completed" | "cancelled" | "disputed" | "refunded";
      order_event_type: "created" | "payment_marked_sent" | "payment_confirmed" | "delivered" | "buyer_confirmed" | "cancelled" | "dispute_opened" | "dispute_resolved" | "refunded" | "note";
      dispute_status: "open" | "under_review" | "resolved_buyer" | "resolved_seller" | "closed";
      report_target_type: "listing" | "profile" | "message" | "review";
      report_status: "open" | "reviewing" | "actioned" | "dismissed";
      notification_type: "message" | "offer" | "order_update" | "dispute" | "review" | "system";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
