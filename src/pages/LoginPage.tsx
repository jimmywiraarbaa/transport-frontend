import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Stack,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/api/client";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: () => authApi.login(username, password),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token, data.refresh_token);
      navigate("/");
    },
    onError: (e: ApiError) => setError(e.message ?? "Login gagal"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    mutation.mutate();
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Selamat datang kembali
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Masuk untuk mengelola perawatan kendaraan Anda
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
          autoComplete="username"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          loading={mutation.isPending}
        >
          Masuk
        </Button>
      </Stack>
    </Box>
  );
}
