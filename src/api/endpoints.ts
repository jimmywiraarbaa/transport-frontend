import { api } from "./client";
import type {
  Vehicle,
  VehicleType,
  MaintenancePart,
  ScheduleRule,
  MaintenanceRecord,
  AlertSummary,
} from "@/types";

// ---- Vehicle Types ----
export const vehicleTypeApi = {
  list: () => api.get<VehicleType[]>("/vehicle-types"),
};

// ---- Maintenance Parts ----
export const maintenancePartApi = {
  list: () => api.get<MaintenancePart[]>("/maintenance-parts"),
};

// ---- Schedule Rules ----
export const scheduleRuleApi = {
  list: () => api.get<ScheduleRule[]>("/schedule-rules"),
  listByVehicleType: (vtId: string) =>
    api.get<ScheduleRule[]>(`/vehicle-types/${vtId}/schedule-rules`),
};

// ---- Vehicles ----
export const vehicleApi = {
  list: (page = 1, perPage = 20) =>
    api.get<Vehicle[]>("/vehicles", { page, per_page: perPage }),
  get: (id: string) => api.get<Vehicle>(`/vehicles/${id}`),
  create: (data: Partial<Vehicle>) => api.post<Vehicle>("/vehicles", data),
  update: (id: string, data: Partial<Vehicle>) =>
    api.put<Vehicle>(`/vehicles/${id}`, data),
  updateOdometer: (id: string, odometerKm: number) =>
    api.patch<Vehicle>(`/vehicles/${id}/odometer`, { odometer_km: odometerKm }),
  delete: (id: string) => api.delete<void>(`/vehicles/${id}`),
};

// ---- Maintenance Records ----
export const maintenanceRecordApi = {
  list: (vehicleId: string, page = 1, perPage = 20) =>
    api.get<MaintenanceRecord[]>(`/vehicles/${vehicleId}/maintenance-records`, {
      page,
      per_page: perPage,
    }),
  listAll: (page = 1, perPage = 100, vehicleId?: string) =>
    api.get<MaintenanceRecord[]>("/maintenance-records", {
      page,
      per_page: perPage,
      ...(vehicleId ? { vehicle_id: vehicleId } : {}),
    }),
  get: (id: string) => api.get<MaintenanceRecord>(`/maintenance-records/${id}`),
  create: (vehicleId: string, data: Record<string, unknown>) =>
    api.post<MaintenanceRecord>(`/vehicles/${vehicleId}/maintenance-records`, data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put<MaintenanceRecord>(`/maintenance-records/${id}`, data),
  delete: (id: string) => api.delete<void>(`/maintenance-records/${id}`),
};

// ---- Alerts ----
export const alertApi = {
  compute: (vehicleId: string) =>
    api.get<AlertSummary>(`/vehicles/${vehicleId}/alerts`),
};
