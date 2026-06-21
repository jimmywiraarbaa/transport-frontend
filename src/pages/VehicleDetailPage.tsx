import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
  IconButton,
  Skeleton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import BuildIcon from "@mui/icons-material/Build";
import SpeedIcon from "@mui/icons-material/Speed";
import StatusChip from "@/components/StatusChip";
import ConfirmDialog from "@/components/ConfirmDialog";
import RecordFormDialog from "@/components/RecordFormDialog";
import {
  useVehicle,
  useDeleteVehicle,
  useUpdateOdometer,
} from "@/hooks/useVehicles";
import { useAlerts } from "@/hooks/useAlerts";
import { useRecords, useDeleteRecord, useMaintenanceParts } from "@/hooks/useMaintenance";
import type { AlertItem, AlertStatus } from "@/types";
import { useToastStore } from "@/store/toastStore";

const STATUS_ORDER: AlertStatus[] = ["overdue", "due_now", "due_soon", "ok"];

function formatIDR(v: string | null): string {
  if (!v) return "-";
  return Number(v).toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
}

function formatDate(v: string | null): string {
  if (!v) return "-";
  return new Date(v).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);

  const { data: vehicle, isLoading } = useVehicle(id);
  const { data: summary } = useAlerts(id);
  const { data: records, isLoading: recordsLoading } = useRecords(id);
  const { data: parts } = useMaintenanceParts();

  const deleteMut = useDeleteVehicle();
  const deleteRecordMut = useDeleteRecord(id!);
  const odoMut = useUpdateOdometer();

  const [showDelete, setShowDelete] = useState(false);
  const [showRecord, setShowRecord] = useState(false);
  const [presetPart, setPresetPart] = useState<string | undefined>();
  const [showOdo, setShowOdo] = useState(false);
  const [odoValue, setOdoValue] = useState("");

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={120} />
        <Skeleton variant="rounded" height={80} />
        <Skeleton variant="rounded" height={300} />
      </Stack>
    );
  }

  if (!vehicle) {
    return <Alert severity="warning">Kendaraan tidak ditemukan</Alert>;
  }

  const handleDelete = () => {
    deleteMut.mutate(id!, {
      onSuccess: () => {
        showToast("Kendaraan dihapus");
        navigate("/vehicles");
      },
    });
  };

  const handleOdoUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    odoMut.mutate(
      { id: id!, km: Number(odoValue) },
      {
        onSuccess: () => {
          showToast("Odometer diperbarui");
          setShowOdo(false);
          setOdoValue("");
        },
        onError: (e: Error) => showToast(e.message, "error"),
      },
    );
  };

  const openRecord = (partId?: string) => {
    setPresetPart(partId);
    setShowRecord(true);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/vehicles")}
            sx={{ mb: 1, px: 0 }}
          >
            Kembali
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {[vehicle.brand, vehicle.model].filter(Boolean).join(" ") ||
              vehicle.plate_number}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {vehicle.plate_number}
            {vehicle.year ? ` · ${vehicle.year}` : ""}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SpeedIcon />}
            onClick={() => setShowOdo(true)}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          >
            Update Odometer
          </Button>
          <IconButton size="small" onClick={() => setShowOdo(true)} sx={{ display: { xs: "inline-flex", sm: "none" } }}>
            <SpeedIcon />
          </IconButton>
          <IconButton size="small" onClick={() => navigate(`/vehicles/${id}/edit`)}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => setShowDelete(true)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Alert summary cards */}
      {summary && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
            gap: 2,
            mb: 3,
          }}
        >
          <SummaryCard label="Overdue" value={summary.overdue} color="#dc2626" />
          <SummaryCard label="Belum Servis" value={summary.due_now} color="#d97706" />
          <SummaryCard label="Segera" value={summary.due_soon} color="#2563eb" />
          <SummaryCard label="Aman" value={summary.ok} color="#16a34a" />
        </Box>
      )}

      {/* Alerts list */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Status Perawatan
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <SpeedIcon sx={{ fontSize: 18, color: "primary.main" }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.dark" }}>
                {vehicle.current_odometer_km.toLocaleString("id-ID")} km
              </Typography>
            </Box>
          </Box>

          <Stack spacing={1.5}>
            {summary?.alerts
              .sort(
                (a, b) =>
                  STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status),
              )
              .map((alert) => (
                <AlertRow
                  key={alert.part_id}
                  alert={alert}
                  onLogService={() => openRecord(alert.part_id)}
                />
              ))}
            {!summary && (
              <Skeleton variant="rounded" height={60} />
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Maintenance records */}
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Riwayat Servis
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => openRecord()}
            >
              Catat Servis
            </Button>
          </Box>

          {recordsLoading ? (
            <Skeleton variant="rounded" height={200} />
          ) : !records || records.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <BuildIcon sx={{ fontSize: 40, color: "text.disabled" }} />
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                Belum ada riwayat servis
              </Typography>
            </Box>
          ) : (
            <>
              {/* Desktop: table */}
              <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ display: { xs: "none", md: "block" } }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tanggal</TableCell>
                      <TableCell>Komponen</TableCell>
                      <TableCell sx={{ textAlign: "right" }}>Odometer</TableCell>
                      <TableCell sx={{ textAlign: "right" }}>Biaya</TableCell>
                      <TableCell>Teknisi</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {records.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{formatDate(r.performed_at)}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {parts?.find((p) => p.id === r.part_id)?.name ?? r.part_id.slice(0, 8)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          {r.odometer_km.toLocaleString("id-ID")} km
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          {formatIDR(r.cost)}
                        </TableCell>
                        <TableCell>{r.technician || "-"}</TableCell>
                        <TableCell>
                          <Tooltip title="Hapus">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => deleteRecordMut.mutate(r.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Mobile: cards */}
              <Box sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", gap: 1.5 }}>
                {records.map((r) => (
                  <Card key={r.id} variant="outlined">
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {parts?.find((p) => p.id === r.part_id)?.name ?? r.part_id.slice(0, 8)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {formatDate(r.performed_at)} · {r.odometer_km.toLocaleString("id-ID")} km
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => deleteRecordMut.mutate(r.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Biaya: {formatIDR(r.cost)}
                        </Typography>
                        {r.technician && (
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Teknisi: {r.technician}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ConfirmDialog
        open={showDelete}
        title="Hapus Kendaraan"
        message={`Yakin ingin menghapus ${vehicle.plate_number}? Semua riwayat servis juga akan dihapus.`}
        onConfirm={handleDelete}
        onClose={() => setShowDelete(false)}
        loading={deleteMut.isPending}
      />

      <RecordFormDialog
        open={showRecord}
        vehicleId={id!}
        vehicleTypeId={vehicle.vehicle_type_id}
        presetPartId={presetPart}
        onClose={() => {
          setShowRecord(false);
          setPresetPart(undefined);
        }}
      />

      <Dialog open={showOdo} onClose={() => setShowOdo(false)} maxWidth="xs" fullWidth>
        <Box component="form" onSubmit={handleOdoUpdate}>
          <DialogTitle>Update Odometer</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              Saat ini: {vehicle.current_odometer_km.toLocaleString("id-ID")} km
            </Typography>
            <TextField
              label="Odometer Baru (km)"
              type="number"
              value={odoValue}
              onChange={(e) => setOdoValue(e.target.value)}
              required
              fullWidth
              autoFocus
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setShowOdo(false)}>Batal</Button>
            <Button type="submit" variant="contained" loading={odoMut.isPending}>
              Update
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card sx={{ border: "1px solid #e2e8f0" }}>
      <CardContent sx={{ textAlign: "center", py: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color }}>
          {value}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
}

function AlertRow({
  alert,
  onLogService,
}: {
  alert: AlertItem;
  onLogService: () => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { sm: "center" },
        gap: { xs: 1, sm: 2 },
        p: 1.5,
        borderRadius: 2,
        bgcolor: alert.status === "ok" ? "transparent" : "action.hover",
      }}
    >
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
        <StatusChip status={alert.status} size="small" />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {alert.part_name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {alert.trigger_mode}
            {alert.interval_km ? ` · ${alert.interval_km.toLocaleString("id-ID")} km` : ""}
            {alert.interval_days ? ` · ${alert.interval_days} hari` : ""}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1.5 }, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
        {alert.next_km_due !== null && (
          <Chip
            label={
              alert.km_remaining !== null && alert.km_remaining >= 0
                ? `${alert.km_remaining.toLocaleString("id-ID")} km lagi`
                : alert.next_km_due !== null
                  ? `Lewat ${Math.abs(alert.km_remaining!).toLocaleString("id-ID")} km`
                  : ""
            }
            size="small"
            variant="outlined"
            color={alert.km_remaining !== null && alert.km_remaining < 0 ? "error" : "default"}
          />
        )}
        {alert.next_date_due !== null && alert.days_remaining !== null && (
          <Chip
            label={
              alert.days_remaining >= 0
                ? `${alert.days_remaining} hari lagi`
                : `Lewat ${Math.abs(alert.days_remaining)} hari`
            }
            size="small"
            variant="outlined"
            color={alert.days_remaining < 0 ? "error" : "default"}
          />
        )}
        {alert.last_performed_at && (
          <Typography variant="caption" sx={{ color: "text.secondary", display: { xs: "none", sm: "block" } }}>
            Terakhir: {formatDate(alert.last_performed_at)}
          </Typography>
        )}
        <Button size="small" variant="outlined" onClick={onLogService}>
          Servis
        </Button>
      </Box>
    </Box>
  );
}
