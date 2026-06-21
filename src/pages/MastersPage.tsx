import { Box, Typography, Stack, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useVehicleTypes } from "@/hooks/useVehicles";
import { useMaintenanceParts, useAllScheduleRules } from "@/hooks/useMaintenance";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Chip,
  Card,
  CardContent,
  TextField,
  MenuItem,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon from "@mui/icons-material/Build";
import ScheduleIcon from "@mui/icons-material/Schedule";

export default function MastersPage() {
  const [tab, setTab] = useState(0);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Data Master
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Referensi jenis kendaraan, komponen, dan aturan jadwal servis
        </Typography>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          minHeight: 44,
          "& .MuiTab-root": {
            minWidth: { xs: 90, sm: 160 },
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
            textTransform: "none",
          },
        }}
      >
        <Tab label="Jenis Kendaraan" />
        <Tab label="Komponen" />
        <Tab label="Aturan Jadwal" />
      </Tabs>

      {tab === 0 && <VehicleTypesTab />}
      {tab === 1 && <PartsTab />}
      {tab === 2 && <RulesTab />}
    </Stack>
  );
}

/* ---------- Vehicle Types ---------- */

function VehicleTypesTab() {
  const { data, isLoading } = useVehicleTypes();
  if (isLoading) return <Skeleton variant="rounded" height={200} />;

  const items = data ?? [];

  return (
    <>
      {/* Desktop table */}
      <TableContainer
        component={Paper}
        elevation={0}
        variant="outlined"
        sx={{ overflowX: "auto", display: { xs: "none", md: "block" } }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nama</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Deskripsi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((t) => (
              <TableRow key={t.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{t.name}</TableCell>
                <TableCell>
                  <Chip label={t.slug} size="small" variant="outlined" />
                </TableCell>
                <TableCell>{t.description || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile cards */}
      <Box sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", gap: 1.5 }}>
        {items.map((t) => (
          <Card key={t.id} variant="outlined">
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: t.description ? 1 : 0 }}>
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
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {t.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {t.slug}
                  </Typography>
                </Box>
              </Box>
              {t.description && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {t.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <EmptyState />}
      </Box>
    </>
  );
}

/* ---------- Parts ---------- */

function PartsTab() {
  const { data, isLoading } = useMaintenanceParts();
  if (isLoading) return <Skeleton variant="rounded" height={300} />;

  const items = data ?? [];

  return (
    <>
      {/* Desktop table */}
      <TableContainer
        component={Paper}
        elevation={0}
        variant="outlined"
        sx={{ overflowX: "auto", display: { xs: "none", md: "block" } }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nama</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Deskripsi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{p.name}</TableCell>
                <TableCell>
                  <Chip label={p.category} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip label={p.slug} size="small" variant="outlined" />
                </TableCell>
                <TableCell>{p.description || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile cards */}
      <Box sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", gap: 1.5 }}>
        {items.map((p) => (
          <Card key={p.id} variant="outlined">
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 1 }}>
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
                  <BuildIcon sx={{ color: "primary.main", fontSize: 22 }} />
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {p.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {p.slug}
                  </Typography>
                </Box>
                <Chip label={p.category} size="small" variant="outlined" sx={{ flexShrink: 0 }} />
              </Box>
              {p.description && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {p.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <EmptyState />}
      </Box>
    </>
  );
}

/* ---------- Rules ---------- */

function RulesTab() {
  const { data: types } = useVehicleTypes();
  const { data: parts } = useMaintenanceParts();
  const { data: rules, isLoading } = useAllScheduleRules();
  const [filterType, setFilterType] = useState("");

  const partName = (id: string) => parts?.find((p) => p.id === id)?.name ?? id;
  const typeName = (id: string) => types?.find((t) => t.id === id)?.name ?? id.slice(0, 8);

  if (isLoading) return <Skeleton variant="rounded" height={300} />;

  const items = (rules ?? []).filter((r) => !filterType || r.vehicle_type_id === filterType);

  return (
    <>
      {/* Filter */}
      <TextField
        select
        size="small"
        label="Filter Jenis Kendaraan"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        sx={{ minWidth: { xs: "100%", sm: 260 } }}
      >
        <MenuItem value="">Semua Jenis Kendaraan</MenuItem>
        {(types ?? []).map((t) => (
          <MenuItem key={t.id} value={t.id}>
            {t.name}
          </MenuItem>
        ))}
      </TextField>

      {/* Desktop table */}
      <TableContainer
        component={Paper}
        elevation={0}
        variant="outlined"
        sx={{ overflowX: "auto", display: { xs: "none", md: "block" } }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Komponen</TableCell>
              <TableCell>Jenis Kendaraan</TableCell>
              <TableCell sx={{ textAlign: "right" }}>Interval KM</TableCell>
              <TableCell sx={{ textAlign: "right" }}>Interval Hari</TableCell>
              <TableCell>Trigger</TableCell>
              <TableCell>Catatan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{partName(r.part_id)}</TableCell>
                <TableCell>
                  <Chip label={typeName(r.vehicle_type_id)} size="small" variant="outlined" />
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  {r.interval_km ? r.interval_km.toLocaleString("id-ID") : "-"}
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>{r.interval_days ?? "-"}</TableCell>
                <TableCell>
                  <Chip label={r.trigger_mode} size="small" variant="outlined" />
                </TableCell>
                <TableCell>{r.notes || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile cards */}
      <Box sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", gap: 1.5 }}>
        {items.map((r) => (
          <Card key={r.id} variant="outlined">
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
                  <ScheduleIcon sx={{ color: "primary.main", fontSize: 22 }} />
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {partName(r.part_id)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {typeName(r.vehicle_type_id)} · Trigger: {r.trigger_mode}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {r.interval_km && (
                  <Chip label={`${r.interval_km.toLocaleString("id-ID")} km`} size="small" />
                )}
                {r.interval_days && (
                  <Chip label={`${r.interval_days} hari`} size="small" />
                )}
                {!r.interval_km && !r.interval_days && (
                  <Chip label="Tanpa interval" size="small" variant="outlined" />
                )}
              </Box>
              {r.notes && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mt: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {r.notes}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <EmptyState />}
      </Box>
    </>
  );
}

/* ---------- Shared helpers ---------- */

function EmptyState() {
  return (
    <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Belum ada data
      </Typography>
    </Paper>
  );
}
