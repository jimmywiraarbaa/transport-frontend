import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, CircularProgress } from "@mui/material";
import { theme } from "@/theme/theme";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { setAuthFailureHandler } from "@/api/client";
import ToastProvider from "@/components/ToastProvider";
import AuthLayout from "@/layouts/AuthLayout";
import AppLayout from "@/layouts/AppLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";

// Lazy-load feature pages for code splitting
const VehiclesPage = lazy(() => import("@/pages/VehiclesPage"));
const VehicleFormPage = lazy(() => import("@/pages/VehicleFormPage"));
const VehicleDetailPage = lazy(() => import("@/pages/VehicleDetailPage"));
const MastersPage = lazy(() => import("@/pages/MastersPage"));
const RecordsPage = lazy(() => import("@/pages/RecordsPage"));

function ProtectedApp() {
  useAuthBootstrap();
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/vehicles" element={<SuspenseLazy><VehiclesPage /></SuspenseLazy>} />
          <Route path="/vehicles/new" element={<SuspenseLazy><VehicleFormPage /></SuspenseLazy>} />
          <Route path="/vehicles/:id" element={<SuspenseLazy><VehicleDetailPage /></SuspenseLazy>} />
          <Route path="/vehicles/:id/edit" element={<SuspenseLazy><VehicleFormPage /></SuspenseLazy>} />
          <Route path="/records" element={<SuspenseLazy><RecordsPage /></SuspenseLazy>} />
          <Route path="/masters" element={<SuspenseLazy><MastersPage /></SuspenseLazy>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthBridge />
        <ProtectedApp />
        <ToastProvider />
      </BrowserRouter>
    </ThemeProvider>
  );
}

/** Bridges the API client's auth-failure callback to React Router navigation. */
function AuthBridge() {
  const navigate = useNavigate();
  useEffect(() => {
    setAuthFailureHandler(() => navigate("/login"));
    return () => setAuthFailureHandler(() => {});
  }, [navigate]);
  return null;
}

/** Suspense wrapper with centered spinner for lazy-loaded pages. */
function SuspenseLazy({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      }
    >
      {children}
    </Suspense>
  );
}
