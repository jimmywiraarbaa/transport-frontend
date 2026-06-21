import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  useVehicleTypes,
  useCreateVehicle,
  useUpdateVehicle,
  useVehicle,
} from "@/hooks/useVehicles";
import { useToastStore } from "@/store/toastStore";

export default function VehicleFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);

  const { data: types, isLoading: typesLoading } = useVehicleTypes();
  const { data: existing, isLoading: vehicleLoading } = useVehicle(id);

  const createMut = useCreateVehicle();
  const updateMut = useUpdateVehicle();

  const [form, setForm] = useState({
    vehicle_type_id: "",
    plate_number: "",
    brand: "",
    model: "",
    year: "",
    current_odometer_km: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Pre-fill form when editing
  if (isEdit && existing && !initialized) {
    setForm({
      vehicle_type_id: existing.vehicle_type_id,
      plate_number: existing.plate_number,
      brand: existing.brand,
      model: existing.model,
      year: existing.year?.toString() ?? "",
      current_odometer_km: existing.current_odometer_km.toString(),
      notes: existing.notes,
    });
    setInitialized(true);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload = {
      vehicle_type_id: form.vehicle_type_id,
      plate_number: form.plate_number.toUpperCase(),
      brand: form.brand,
      model: form.model,
      year: form.year ? Number(form.year) : null,
      current_odometer_km: Number(form.current_odometer_km) || 0,
      notes: form.notes,
    };

    const onSuccess = (v: { id: string }) => {
      showToast(isEdit ? "Kendaraan diperbarui" : "Kendaraan ditambahkan");
      navigate(`/vehicles/${v.id}`);
    };
    const onError = (e: Error) => {
      setError(e.message);
      showToast(e.message, "error");
    };

    if (isEdit && id) {
      updateMut.mutate({ id, data: payload }, { onSuccess, onError });
    } else {
      createMut.mutate(payload, { onSuccess, onError });
    }
  };

  const loading = typesLoading || (isEdit && vehicleLoading);
  const submitting = createMut.isPending || updateMut.isPending;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Kembali
      </Button>

      <Card sx={{ maxWidth: 640 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            {isEdit ? "Edit Kendaraan" : "Tambah Kendaraan"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                select
                label="Jenis Kendaraan"
                value={form.vehicle_type_id}
                onChange={(e) => setForm((f) => ({ ...f, vehicle_type_id: e.target.value }))}
                required
                fullWidth
              >
                {(types ?? []).map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Plat Nomor"
                value={form.plate_number}
                onChange={(e) => setForm((f) => ({ ...f, plate_number: e.target.value }))}
                required
                fullWidth
                placeholder="B 1234 ABC"
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <TextField
                  label="Merek"
                  value={form.brand}
                  onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                  fullWidth
                  placeholder="Honda"
                />
                <TextField
                  label="Model"
                  value={form.model}
                  onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                  fullWidth
                  placeholder="CBR 250RR"
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <TextField
                  label="Tahun"
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Odometer (km)"
                  type="number"
                  value={form.current_odometer_km}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, current_odometer_km: e.target.value }))
                  }
                  fullWidth
                  disabled={isEdit}
                  helperText={isEdit ? "Update via odometer pada detail" : ""}
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

              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  fullWidth
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  loading={submitting}
                  fullWidth
                >
                  {isEdit ? "Simpan" : "Tambah"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
