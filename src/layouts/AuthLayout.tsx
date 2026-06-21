import { Outlet, Navigate } from "react-router-dom";
import { Box, Container, Paper, Typography } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { useAuthStore } from "@/store/authStore";

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f6f4ff 0%, #f8fafc 60%)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DirectionsCarIcon sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.dark" }}>
              Transport Care
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              width: "100%",
              p: { xs: 3, sm: 5 },
              border: "1px solid #e2e8f0",
              borderRadius: 4,
            }}
          >
            <Outlet />
          </Paper>

          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Kelola perawatan kendaraan Anda dengan mudah
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
