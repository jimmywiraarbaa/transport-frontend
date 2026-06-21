import { Chip } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ErrorIcon from "@mui/icons-material/Error";
import type { AlertStatus } from "@/types";

const CONFIG: Record<
  AlertStatus,
  { label: string; color: "error" | "warning" | "info" | "success"; icon: React.ReactElement }
> = {
  overdue: { label: "Overdue", color: "error", icon: <ErrorIcon fontSize="small" /> },
  due_now: { label: "Belum Diservis", color: "warning", icon: <WarningAmberIcon fontSize="small" /> },
  due_soon: { label: "Segera", color: "info", icon: <ScheduleIcon fontSize="small" /> },
  ok: { label: "Aman", color: "success", icon: <CheckCircleIcon fontSize="small" /> },
};

export default function StatusChip({ status, size = "medium" }: { status: AlertStatus; size?: "small" | "medium" }) {
  const cfg = CONFIG[status];
  return (
    <Chip
      icon={cfg.icon}
      label={cfg.label}
      color={cfg.color}
      size={size}
      variant="outlined"
    />
  );
}
