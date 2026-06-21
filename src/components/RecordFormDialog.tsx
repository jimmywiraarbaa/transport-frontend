import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Box,
} from "@mui/material";
import {
  useCreateRecord,
  useCreateRecordStandalone,
  useScheduleRules,
} from "@/hooks/useMaintenance";
import { useVehicles } from "@/hooks/useVehicles";
import { useToastStore } from "@/store/toastStore";
import type { Vehicle } from "@/types";

interface Props {
  open: boolean;
  vehicleId?: string;
  vehicleTypeId?: string;
  onClose: () => void;
  presetPartId?: string;
  standalone?: boolean;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function RecordFormDialog({
  open,
  vehicleId: fixedVehicleId,
  vehicleTypeId: fixedVehicleTypeId,
  onClose,
  presetPartId,
  standalone,
}: Props) {
  const { data: vehicles } = useVehicles();
  const showToast = useToastStore((s) => s.show);

  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [form, setForm] = useState({
    part_id: "",
    performed_at: todayISO(),
    odometer_km: "",
    cost: "",
    technician: "",
    notes: "",
  });
  const [error, setError] = useState("");

  const activeVehicleId = standalone ? selectedVehicleId : fixedVehicleId;
  const activeVehicle = vehicles?.find((v) => v.id === activeVehicleId);
  const activeVehicleTypeId = standalone
    ? activeVehicle?.vehicle_type_id
    : fixedVehicleTypeId;

  const { data: rules } = useScheduleRules(activeVehicleTypeId);
  const createMut = useCreateRecord(fixedVehicleId ?? "");
  const standaloneMut = useCreateRecordStandalone();

  useEffect(() => {
    if (open && presetPartId) {
      setForm((f) => ({ ...f, part_id: presetPartId }));
    }
  }, [open, presetPartId]);

  useEffect(() => {
    if (!open) {
      setSelectedVehicleId("");
      setError("");
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!activeVehicleId) {
      setError("Pilih kendaraan terlebih dahulu");
      return;
    }

    const payload = {
      part_id: form.part_id,
      performed_at: form.performed_at,
      odometer_km: Number(form.odometer_km) || 0,
      cost: form.cost || "0",
      technician: form.technician,
      notes: form.notes,
    };

    const onSuccess = () => {
      showToast("Servis tercatat");
      onClose();
      setForm({
        part_id: "",
        performed_at: todayISO(),
        odometer_km: "",
        cost: "",
        technician: "",
        notes: "",
      });
    };
    const onError = (e: Error) => setError(e.message);

    if (standalone) {
      standaloneMut.mutate(
        { vehicleId: activeVehicleId, data: payload },
        { onSuccess, onError },
      );
    } else {
      createMut.mutate(payload, { onSuccess, onError });
    }
  };

  const partOptions = (rules ?? []).map((r) => ({
    id: r.part_id,
    label: r.notes || r.id,
  }));

  const vehicleLabel = (v: Vehicle) =>
    [v.brand, v.model].filter(Boolean).join(" ") || v.plate_number;

  const submitting = standalone ? standaloneMut.isPending : createMut.isPending;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Catat Servis</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && (
              <Box sx={{ color: "error.main", fontSize: "0.875rem" }}>{error}</Box>
            )}

            {standalone && (
              <TextField
                select
                label="Kendaraan"
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                required
                fullWidth
              >
                {(vehicles ?? []).map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {vehicleLabel(v)} ({v.plate_number})
                  </MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              select
              label="Komponen"
              value={form.part_id}
              onChange={(e) => setForm((f) => ({ ...f, part_id: e.target.value }))}
              required
              fullWidth
              disabled={standalone && !selectedVehicleId}
            >
              {partOptions.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.label}
                </MenuItem>
              ))}
            </TextField>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Tanggal Servis"
                type="date"
                value={form.performed_at}
                onChange={(e) => setForm((f) => ({ ...f, performed_at: e.target.value }))}
                required
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="Odometer (km)"
                type="number"
                value={form.odometer_km}
                onChange={(e) => setForm((f) => ({ ...f, odometer_km: e.target.value }))}
                required
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Biaya (Rp)"
                type="number"
                value={form.cost}
                onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
                fullWidth
                helperText="Rupiah"
              />
              <TextField
                label="Teknisi / Bengkel"
                value={form.technician}
                onChange={(e) => setForm((f) => ({ ...f, technician: e.target.value }))}
                fullWidth
              />
            </Stack>
            <TextField
              label="Catatan"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              fullWidth
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose}>Batal</Button>
          <Button type="submit" variant="contained" loading={submitting}>
            Simpan
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
