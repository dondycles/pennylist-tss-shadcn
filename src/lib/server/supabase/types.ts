import { z } from "zod";
import { moneySchema } from "../fn/money";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Json = Record<string, any>;
export type ListState = {
  sortBy: "date" | "amount";
  flow: "asc" | "desc";
  setState: ({
    sortBy,
    flow,
  }: {
    sortBy: "date" | "amount";
    flow: "asc" | "desc";
  }) => void;
};
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
          updated_at: string | null;
        };
        Insert: {
          asterisk?: boolean;
          created_at?: string;
          flow?: ListState["flow"];
          id?: string;
          sortBy?: ListState["sortBy"];
          theme?: "dark" | "light";
          userId?: string;
          updated_at?: string | null;
        };
        Update: {
          asterisk?: boolean;
          created_at?: string;
          flow?: ListState["flow"];
          id?: string;
          sortBy?: ListState["sortBy"];
          theme?: "dark" | "light";
          userId?: string;
          updated_at?: string | null;
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
