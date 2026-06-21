/** Shared TypeScript types mirroring the backend API response shapes. */

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface VehicleType {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface MaintenancePart {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduleRule {
  id: string;
  part_id: string;
  vehicle_type_id: string;
  interval_km: number | null;
  interval_days: number | null;
  trigger_mode: "or" | "and" | "km_only" | "date_only";
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  user_id: string;
  vehicle_type_id: string;
  plate_number: string;
  brand: string;
  model: string;
  year: number | null;
  current_odometer_km: number;
  initial_odometer_km?: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicle_id: string;
  user_id: string;
  part_id: string;
  performed_at: string;
  odometer_km: number;
  cost: string;
  technician: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type AlertStatus = "ok" | "due_soon" | "overdue" | "due_now";

export interface AlertItem {
  vehicle_id: string;
  part_id: string;
  part_name: string;
  part_slug: string;
  part_category: string;
  schedule_rule_id: string;
  trigger_mode: string;
  interval_km: number | null;
  interval_days: number | null;
  status: AlertStatus;
  last_odometer_km: number;
  next_km_due: number | null;
  km_remaining: number | null;
  last_performed_at: string | null;
  next_date_due: string | null;
  days_remaining: number | null;
  has_record: boolean;
  last_record_cost: string | null;
  rule_notes: string;
}

export interface AlertSummary {
  vehicle_id: string;
  vehicle_type_id: string;
  current_odometer_km: number;
  plate_number: string;
  total: number;
  overdue: number;
  due_now: number;
  due_soon: number;
  ok: number;
  has_urgent: boolean;
  alerts: AlertItem[];
}

/** API envelope: { success, data, meta, error } */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: { page: number; per_page: number; total: number };
  error?: { code: string; message: string; details?: unknown };
}

export interface Paginated<T> {
  items: T;
  total: number;
}
