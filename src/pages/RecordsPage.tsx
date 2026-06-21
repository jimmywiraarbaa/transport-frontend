import { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
  Skeleton,
  Chip,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import BuildIcon from "@mui/icons-material/Build";
import PaymentsIcon from "@mui/icons-material/Payments";
import HistoryIcon from "@mui/icons-material/History";
import { useNavigate } from "react-router-dom";
import { useAllRecords, useDeleteRecordStandalone, useMaintenanceParts } from "@/hooks/useMaintenance";
import { useVehicles } from "@/hooks/useVehicles";
import RecordFormDialog from "@/components/RecordFormDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToastStore } from "@/store/toastStore";
import type { MaintenanceRecord } from "@/types";

function formatIDR(v: string | null): string {
  if (!v) return "-";
  return Number(v).toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
}

function formatDate(v: string | null): string {
  if (!v) return "-";
  return new Date(v).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function RecordsPage() {
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);
  const { data: vehicles } = useVehicles();
  const { data: parts } = useMaintenanceParts();
  const deleteMut = useDeleteRecordStandalone();

  const [filterVehicle, setFilterVehicle] = useState("");
  const [showRecord, setShowRecord] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MaintenanceRecord | null>(null);

  const { data: records, isLoading } = useAllRecords(filterVehicle || undefined);

  const vehicleName = (id: string) => {
    const v = vehicles?.find((x) => x.id === id);
    if (!v) return id.slice(0, 8);
    return [v.brand, v.model].filter(Boolean).join(" ") || v.plate_number;
  };
  const vehiclePlate = (id: string) => vehicles?.find((x) => x.id === id)?.plate_number ?? "";
  const partName = (id: string) => parts?.find((p) => p.id === id)?.name ?? id.slice(0, 8);

  const handleDelete = () => {
    if (deleteTarget) {
      deleteMut.mutate(deleteTarget.id, {
        onSuccess: () => showToast("Riwayat servis dihapus"),
      });
      setDeleteTarget(null);
    }
  };

  const totalCost = (records ?? []).reduce((sum, r) => sum + Number(r.cost || 0), 0);
  const now = new Date();
  const thisMonth = (records ?? []).filter((r) => {
    const d = new Date(r.performed_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthCost = thisMonth.reduce((sum, r) => sum + Number(r.cost || 0), 0);

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { sm: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Riwayat Servis
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Semua catatan servis kendaraan Anda
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowRecord(true)}
        >
          Catat Servis
        </Button>
      </Box>

      {/* Summary cards */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SummaryCard
            icon={<HistoryIcon />}
            label="Total Servis"
            value={(records?.length ?? 0).toString()}
            sub={thisMonth.length > 0 ? `${thisMonth.length} bulan ini` : "Belum ada bulan ini"}
            color="#7c3aed"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SummaryCard
            icon={<PaymentsIcon />}
            label="Total Biaya"
            value={formatIDR(totalCost.toString())}
            sub="Sepanjang waktu"
            color="#2563eb"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SummaryCard
            icon={<BuildIcon />}
            label="Biaya Bulan Ini"
            value={formatIDR(thisMonthCost.toString())}
            sub={`${thisMonth.length} kali servis`}
            color="#16a34a"
          />
        </Grid>
      </Grid>

      {/* Filter bar */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          select
          size="small"
          label="Filter Kendaraan"
          value={filterVehicle}
          onChange={(e) => setFilterVehicle(e.target.value)}
          sx={{ minWidth: { xs: "100%", sm: 260 } }}
        >
          <MenuItem value="">Semua Kendaraan</MenuItem>
          {(vehicles ?? []).map((v) => (
            <MenuItem key={v.id} value={v.id}>
              {[v.brand, v.model].filter(Boolean).join(" ") || v.plate_number} ({v.plate_number})
            </MenuItem>
          ))}
        </TextField>
        {filterVehicle && (
          <Button size="small" onClick={() => setFilterVehicle("")}>
            Reset Filter
          </Button>
        )}
      </Box>

      {/* Records list */}
      {isLoading ? (
        <Stack spacing={1}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={56} />
          ))}
        </Stack>
      ) : !records || records.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: "center" }}>
          <BuildIcon sx={{ fontSize: 48, color: "text.disabled" }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Belum ada riwayat servis
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            {filterVehicle
              ? "Kendaraan ini belum memiliki catatan servis"
              : "Catat servis pertama Anda untuk mulai melacak perawatan"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowRecord(true)}
          >
            Catat Servis
          </Button>
        </Paper>
      ) : (
        <>
          {/* Desktop: table */}
          <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ display: { xs: "none", md: "block" } }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tanggal</TableCell>
                  <TableCell>Kendaraan</TableCell>
                  <TableCell>Komponen</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>Odometer</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>Biaya</TableCell>
                  <TableCell>Teknisi</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>{formatDate(r.performed_at)}</TableCell>
                    <TableCell>
                      <Box
                        sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
                        onClick={() => navigate(`/vehicles/${r.vehicle_id}`)}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {vehicleName(r.vehicle_id)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          {vehiclePlate(r.vehicle_id)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={partName(r.part_id)} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {r.odometer_km.toLocaleString("id-ID")} km
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {formatIDR(r.cost)}
                    </TableCell>
                    <TableCell>{r.technician || "-"}</TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Tooltip title="Hapus">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteTarget(r)}
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
              <RecordMobileCard
                key={r.id}
                record={r}
                vehicleName={vehicleName(r.vehicle_id)}
                vehiclePlate={vehiclePlate(r.vehicle_id)}
                partName={partName(r.part_id)}
                onView={() => navigate(`/vehicles/${r.vehicle_id}`)}
                onDelete={() => setDeleteTarget(r)}
              />
            ))}
          </Box>
        </>
      )}

      {/* Dialogs */}
      <RecordFormDialog
        open={showRecord}
        standalone
        onClose={() => setShowRecord(false)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Riwayat Servis"
        message={`Yakin ingin menghapus servis ${deleteTarget ? partName(deleteTarget.part_id) : ""} pada ${deleteTarget ? formatDate(deleteTarget.performed_at) : ""}?`}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        loading={deleteMut.isPending}
      />
    </Stack>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              bgcolor: `${color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Box sx={{ color, "& svg": { fontSize: 24 } }}>{icon}</Box>
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="overline" sx={{ color: "text.secondary", lineHeight: 1 }}>
              {label}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {value}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {sub}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function RecordMobileCard({
  record: r,
  vehicleName,
  vehiclePlate,
  partName,
  onView,
  onDelete,
}: {
  record: MaintenanceRecord;
  vehicleName: string;
  vehiclePlate: string;
  partName: string;
  onView: () => void;
  onDelete: () => void;
}) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 1.5 }}>
          <Box sx={{ minWidth: 0, cursor: "pointer" }} onClick={onView}>
            <Typography variant="body2" sx={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {vehicleName}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {vehiclePlate} · {formatDate(r.performed_at)}
            </Typography>
          </Box>
          <IconButton size="small" color="error" onClick={onDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
          <Chip label={partName} size="small" variant="outlined" />
          <Chip label={`${r.odometer_km.toLocaleString("id-ID")} km`} size="small" />
          {r.cost && Number(r.cost) > 0 && (
            <Chip label={formatIDR(r.cost)} size="small" color="primary" variant="outlined" />
          )}
          {r.technician && (
            <Chip label={r.technician} size="small" variant="outlined" sx={{ color: "text.secondary" }} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
