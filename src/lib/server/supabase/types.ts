import { ListState } from "@/lib/stores/list-state";
import { z } from "zod";
import { moneySchema } from "../fn/money";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Json = Record<string, any>;

export type MoneyPrimaryDataOnly = Omit<z.infer<typeof moneySchema>, "reason">;
export type Changes = {
  prev: MoneyPrimaryDataOnly & { totalMoney: number };
  current: MoneyPrimaryDataOnly & { totalMoney: number };
};
export type TransferDetails = {
  sender: MoneyPrimaryDataOnly & { id: string };
  receivers: (MoneyPrimaryDataOnly & {
    id: string;
    fee?: number | null;
    cashIn?: number | null;
  })[];
};

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      log: {
        Row: {
          changes: Changes;
          created_at: string;
          id: string;
          moneyId: string;
          reason: string | null;
          transferDetails: TransferDetails | null;
          type: string;
          userId: string | null;
        };
        Insert: {
          changes: Changes;
          created_at?: string;
          id?: string;
          moneyId: string;
          reason?: string | null;
          transferDetails?: TransferDetails | null;
          type: string;
          userId?: string | null;
        };
        Update: {
          changes?: Changes;
          created_at?: string;
          id?: string;
          moneyId?: string;
          reason?: string | null;
          transferDetails?: TransferDetails | null;
          type?: string;
          userId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "log_moneyId_fkey";
            columns: ["moneyId"];
            isOneToOne: false;
            referencedRelation: "money";
            referencedColumns: ["id"];
          },
        ];
      };
      money: {
        Row: {
          amount: number;
          color: string | null;
          created_at: string;
          id: string;
          name: string;
          updated_at: string | null;
          userId: string | null;
        };
        Insert: {
          amount?: number;
          color?: string | null;
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string | null;
          userId?: string | null;
        };
        Update: {
          amount?: number;
          color?: string | null;
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string | null;
          userId?: string | null;
        };
        Relationships: [];
      };
      setting: {
        Row: {
          asterisk: boolean;
          created_at: string;
          flow: ListState["flow"];
          id: string;
          sortBy: ListState["sortBy"];
          theme: "dark" | "light";
          userId: string;
        };
        Insert: {
          asterisk?: boolean;
          created_at?: string;
          flow?: ListState["flow"];
          id?: string;
          sortBy?: ListState["sortBy"];
          theme?: "dark" | "light";
          userId?: string;
        };
        Update: {
          asterisk?: boolean;
          created_at?: string;
          flow?: ListState["flow"];
          id?: string;
          sortBy?: ListState["sortBy"];
          theme?: "dark" | "light";
          userId?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
