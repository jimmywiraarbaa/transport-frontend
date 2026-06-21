import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Skeleton,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { useVehicles, useVehicleTypes, useDeleteVehicle } from "@/hooks/useVehicles";
import { useAlerts } from "@/hooks/useAlerts";
import ConfirmDialog from "@/components/ConfirmDialog";
import StatusChip from "@/components/StatusChip";
import { useToastStore } from "@/store/toastStore";
import type { Vehicle } from "@/types";

export default function VehiclesPage() {
  const navigate = useNavigate();
  const { data: vehicles, isLoading } = useVehicles();
  const { data: types } = useVehicleTypes();
  const deleteMut = useDeleteVehicle();
  const showToast = useToastStore((s) => s.show);
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);

  const typeName = (id: string) =>
    types?.find((t) => t.id === id)?.name ?? "-";

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { sm: "center" }, gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Kendaraan
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Daftar kendaraan Anda
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/vehicles/new")}
        >
          Tambah
        </Button>
      </Box>

      {isLoading ? (
        <Skeleton variant="rounded" height={300} />
      ) : !vehicles || vehicles.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
            Belum ada kendaraan terdaftar
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/vehicles/new")}
          >
            Tambah Kendaraan Pertama
          </Button>
        </Paper>
      ) : (
        <>
          {/* Desktop: table */}
          <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ display: { xs: "none", md: "block" } }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Plat Nomor</TableCell>
                  <TableCell>Kendaraan</TableCell>
                  <TableCell>Jenis</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>Odometer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.map((v) => (
                  <VehicleRow
                    key={v.id}
                    vehicle={v}
                    typeName={typeName(v.vehicle_type_id)}
                    onView={() => navigate(`/vehicles/${v.id}`)}
                    onEdit={() => navigate(`/vehicles/${v.id}/edit`)}
                    onDelete={() => setDeleteTarget(v)}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Mobile: cards */}
          <Box sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", gap: 1.5 }}>
            {vehicles.map((v) => (
              <VehicleMobileCard
                key={v.id}
                vehicle={v}
                typeName={typeName(v.vehicle_type_id)}
                onView={() => navigate(`/vehicles/${v.id}`)}
                onEdit={() => navigate(`/vehicles/${v.id}/edit`)}
                onDelete={() => setDeleteTarget(v)}
              />
            ))}
          </Box>
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Kendaraan"
        message={`Yakin ingin menghapus ${deleteTarget?.plate_number}?`}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMut.mutate(deleteTarget.id, {
              onSuccess: () => showToast("Kendaraan dihapus"),
            });
            setDeleteTarget(null);
          }
        }}
        onClose={() => setDeleteTarget(null)}
        loading={deleteMut.isPending}
      />
    </Stack>
  );
}

function VehicleRow({
  vehicle,
  typeName,
  onView,
  onEdit,
  onDelete,
}: {
  vehicle: Vehicle;
  typeName: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { data: summary } = useAlerts(vehicle.id);
  const urgent = (summary?.overdue ?? 0) + (summary?.due_now ?? 0);

  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {vehicle.plate_number}
        </Typography>
      </TableCell>
      <TableCell>
        {[vehicle.brand, vehicle.model].filter(Boolean).join(" ") || "-"}
        {vehicle.year ? ` (${vehicle.year})` : ""}
      </TableCell>
      <TableCell>
        <Chip label={typeName} size="small" variant="outlined" />
      </TableCell>
      <TableCell sx={{ textAlign: "right" }}>
        {vehicle.current_odometer_km.toLocaleString("id-ID")} km
      </TableCell>
      <TableCell>
        {summary ? (
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {summary.overdue > 0 && (
              <Chip label={`${summary.overdue}`} color="error" size="small" />
            )}
            {summary.due_now > 0 && (
              <Chip label={`${summary.due_now}`} color="warning" size="small" />
            )}
            {summary.due_soon > 0 && (
              <Chip label={`${summary.due_soon}`} color="info" size="small" />
            )}
            {urgent === 0 && summary.ok > 0 && (
              <Chip label="Aman" color="success" size="small" variant="outlined" />
            )}
          </Box>
        ) : (
          <Skeleton width={80} />
        )}
      </TableCell>
      <TableCell sx={{ textAlign: "right" }}>
        <IconButton size="small" onClick={onView}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={onEdit}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="error" onClick={onDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

function VehicleMobileCard({
  vehicle,
  typeName,
  onView,
  onEdit,
  onDelete,
}: {
  vehicle: Vehicle;
  typeName: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { data: summary } = useAlerts(vehicle.id);
  const urgent = (summary?.overdue ?? 0) + (summary?.due_now ?? 0);

  return (
    <Card variant="outlined" onClick={onView} sx={{ cursor: "pointer", "&:hover": { borderColor: "primary.light" } }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "primary.50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <DirectionsCarIcon sx={{ color: "primary.main", fontSize: 22 }} />
          </Box>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {[vehicle.brand, vehicle.model].filter(Boolean).join(" ") || vehicle.plate_number}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {vehicle.plate_number} · {vehicle.current_odometer_km.toLocaleString("id-ID")} km
            </Typography>
          </Box>
          <Chip label={typeName} size="small" variant="outlined" />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {summary ? (
              urgent === 0 && summary.ok > 0 ? (
                <StatusChip status="ok" size="small" />
              ) : (
                <>
                  {summary.overdue > 0 && <Chip label={`${summary.overdue} Overdue`} color="error" size="small" />}
                  {summary.due_now > 0 && <Chip label={`${summary.due_now} Servis`} color="warning" size="small" />}
                  {summary.due_soon > 0 && <Chip label={`${summary.due_soon} Segera`} color="info" size="small" />}
                </>
              )
            ) : (
              <Skeleton width={60} height={24} />
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
