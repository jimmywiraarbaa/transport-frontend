import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleApi, vehicleTypeApi } from "@/api/endpoints";
import type { Vehicle } from "@/types";

const KEY = "vehicles";

export function useVehicles() {
  return useQuery({
    queryKey: [KEY],
    queryFn: () => vehicleApi.list(),
  });
}

export function useVehicle(id: string | undefined) {
  return useQuery({
    queryKey: [KEY, id],
    queryFn: () => vehicleApi.get(id!),
    enabled: !!id,
  });
}

export function useVehicleTypes() {
  return useQuery({
    queryKey: ["vehicle-types"],
    queryFn: () => vehicleTypeApi.list(),
  });
}

export function useCreateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Vehicle>) => vehicleApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
    },
  });
}

export function useUpdateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Vehicle> }) =>
      vehicleApi.update(id, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: [KEY] });
      qc.invalidateQueries({ queryKey: [KEY, vars.id] });
    },
  });
}

export function useUpdateOdometer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, km }: { id: string; km: number }) =>
      vehicleApi.updateOdometer(id, km),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: [KEY] });
      qc.invalidateQueries({ queryKey: [KEY, vars.id] });
      qc.invalidateQueries({ queryKey: ["alerts", vars.id] });
    },
  });
}

export function useDeleteVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vehicleApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
    },
  });
}
