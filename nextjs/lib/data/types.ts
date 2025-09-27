// lib/dal/types.ts
export type DalReturn<T> =
  | { success: true; data: T }
  | { success: false; error: DalError };

export type DalError =
  | { type: "no-user" }
  | { type: "no-access"; requiredRole?: string }
  | { type: "supabase-error"; error: unknown }
  | { type: "unknown-error"; error: unknown };

export class ThrowableDalError extends Error {
  constructor(public dalError: DalError) {
    super();
  }
}
