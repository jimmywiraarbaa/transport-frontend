import { Outlet, Navigate } from "react-router-dom";
import { Box, Container, Paper, Typography } from "@mui/material";
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
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
            <Box
              component="img"
              src="/logo-transport-crop.png"
              alt="Transport Care"
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                objectFit: "contain",
                flexShrink: 0,
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "primary.dark",
                fontSize: { xs: "1.5rem", sm: "2rem" },
              }}
            >
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
