import { Snackbar, Alert } from "@mui/material";
import { useToastStore } from "@/store/toastStore";

export default function ToastProvider() {
  const { toasts, dismiss } = useToastStore();

  return (
    <>
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open
          autoHideDuration={4000}
          onClose={() => dismiss(toast.id)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => dismiss(toast.id)}
            severity={toast.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}
