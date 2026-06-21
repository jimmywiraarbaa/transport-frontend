import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
  Chip,
  Skeleton,
  Alert,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useQuery } from "@tanstack/react-query";
import { vehicleApi, alertApi } from "@/api/endpoints";
import type { AlertSummary, Vehicle } from "@/types";

export default function DashboardPage() {
  const navigate = useNavigate();

  const { data: vehicles, isLoading, isError } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => vehicleApi.list(),
  });

  return (
    <Stack spacing={3}>
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
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Ringkasan status perawatan kendaraan Anda
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/vehicles/new")}
        >
          Tambah Kendaraan
        </Button>
      </Box>

      {isError && (
        <Alert severity="error">Gagal memuat data kendaraan</Alert>
      )}

      {isLoading && (
        <Grid container spacing={2}>
          {[1, 2].map((i) => (
            <Grid key={i} size={{ xs: 12, lg: 6 }}>
              <Skeleton variant="rounded" height={140} />
            </Grid>
          ))}
        </Grid>
      )}

      {!isLoading && vehicles?.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: "center", py: { xs: 5, sm: 8 } }}>
            <DirectionsCarIcon sx={{ fontSize: 48, color: "text.disabled" }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Belum ada kendaraan
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
              Tambahkan kendaraan pertama Anda untuk mulai melacak perawatan
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/vehicles/new")}
            >
              Tambah Kendaraan
            </Button>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={2}>
        {vehicles?.map((v) => (
          <Grid key={v.id} size={{ xs: 12, lg: 6 }}>
            <VehicleCard vehicle={v} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const navigate = useNavigate();

  const { data: summary } = useQuery<AlertSummary>({
    queryKey: ["alerts", vehicle.id],
    queryFn: () => alertApi.compute(vehicle.id),
    refetchInterval: 60_000,
  });

  return (
    <Card
      sx={{
        cursor: "pointer",
        height: "100%",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: "0 4px 20px -4px rgba(124,58,237,0.15)" },
      }}
      onClick={() => navigate(`/vehicles/${vehicle.id}`)}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { sm: "center" },
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", minWidth: 0 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                bgcolor: "primary.50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <DirectionsCarIcon sx={{ color: "primary.main" }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {[vehicle.brand, vehicle.model].filter(Boolean).join(" ") ||
                  vehicle.plate_number}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {vehicle.plate_number} ·{" "}
                <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                  {vehicle.current_odometer_km.toLocaleString("id-ID")} km
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>

        {summary ? (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {summary.overdue > 0 && (
              <Chip
                icon={<WarningAmberIcon />}
                label={`${summary.overdue} Overdue`}
                color="error"
                variant="outlined"
                size="small"
              />
            )}
            {summary.due_now > 0 && (
              <Chip
                label={`${summary.due_now} Belum Servis`}
                color="warning"
                variant="outlined"
                size="small"
              />
            )}
            {summary.due_soon > 0 && (
              <Chip
                label={`${summary.due_soon} Segera`}
                color="info"
                variant="outlined"
                size="small"
              />
            )}
            {summary.ok > 0 && (
              <Chip
                icon={<CheckCircleIcon />}
                label={`${summary.ok} Aman`}
                color="success"
                variant="outlined"
                size="small"
              />
            )}
            {summary.overdue === 0 && summary.due_now === 0 && summary.due_soon === 0 && summary.ok === 0 && (
              <Chip label="Menunggu data" size="small" variant="outlined" />
            )}
          </Box>
        ) : (
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Skeleton variant="rounded" width={100} height={24} />
            <Skeleton variant="rounded" width={80} height={24} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
