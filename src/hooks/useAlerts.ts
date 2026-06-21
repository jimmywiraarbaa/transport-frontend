import { useQuery } from "@tanstack/react-query";
import { alertApi } from "@/api/endpoints";

export function useAlerts(vehicleId: string | undefined) {
  return useQuery({
    queryKey: ["alerts", vehicleId],
    queryFn: () => alertApi.compute(vehicleId!),
    enabled: !!vehicleId,
    refetchInterval: 60_000,
  });
}
