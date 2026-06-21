import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { maintenanceRecordApi, scheduleRuleApi, maintenancePartApi } from "@/api/endpoints";

export function useRecords(vehicleId: string | undefined) {
  return useQuery({
    queryKey: ["records", vehicleId],
    queryFn: () => maintenanceRecordApi.list(vehicleId!),
    enabled: !!vehicleId,
  });
}

export function useAllRecords(vehicleId?: string) {
  return useQuery({
    queryKey: ["records", "all", vehicleId ?? "all"],
    queryFn: () => maintenanceRecordApi.listAll(1, 100, vehicleId),
  });
}

export function useCreateRecordStandalone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ vehicleId, data }: { vehicleId: string; data: Record<string, unknown> }) =>
      maintenanceRecordApi.create(vehicleId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["records"] });
      qc.invalidateQueries({ queryKey: ["alerts"] });
      qc.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useDeleteRecordStandalone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => maintenanceRecordApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["records"] });
      qc.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

export function useScheduleRules(vehicleTypeId: string | undefined) {
  return useQuery({
    queryKey: ["schedule-rules", vehicleTypeId],
    queryFn: () => scheduleRuleApi.listByVehicleType(vehicleTypeId!),
    enabled: !!vehicleTypeId,
  });
}

export function useAllScheduleRules() {
  return useQuery({
    queryKey: ["schedule-rules", "all"],
    queryFn: () => scheduleRuleApi.list(),
  });
}

export function useMaintenanceParts() {
  return useQuery({
    queryKey: ["maintenance-parts"],
    queryFn: () => maintenancePartApi.list(),
  });
}

export function useCreateRecord(vehicleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      maintenanceRecordApi.create(vehicleId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["records", vehicleId] });
      qc.invalidateQueries({ queryKey: ["alerts", vehicleId] });
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      qc.invalidateQueries({ queryKey: ["vehicles", vehicleId] });
    },
  });
}

export function useUpdateRecord(vehicleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      maintenanceRecordApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["records", vehicleId] });
      qc.invalidateQueries({ queryKey: ["alerts", vehicleId] });
    },
  });
}

export function useDeleteRecord(vehicleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => maintenanceRecordApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["records", vehicleId] });
      qc.invalidateQueries({ queryKey: ["alerts", vehicleId] });
    },
  });
}
