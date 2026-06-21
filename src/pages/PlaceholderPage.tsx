import { Typography, Box } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <Box sx={{ textAlign: "center", py: 10 }}>
      <ConstructionIcon sx={{ fontSize: 56, color: "text.disabled" }} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Halaman ini akan dikembangkan di fase berikutnya
      </Typography>
    </Box>
  );
}
