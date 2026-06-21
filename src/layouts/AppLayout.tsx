import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Container,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon from "@mui/icons-material/Build";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAuthStore } from "@/store/authStore";

const DRAWER_EXPANDED = 256;
const DRAWER_COLLAPSED = 73;

const NAV_ITEMS = [
  { label: "Dashboard", icon: <DashboardIcon />, to: "/" },
  { label: "Kendaraan", icon: <DirectionsCarIcon />, to: "/vehicles" },
  { label: "Riwayat Servis", icon: <BuildIcon />, to: "/records" },
  { label: "Data Master", icon: <SettingsIcon />, to: "/masters" },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved === "true";
  });

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const drawerWidth = collapsed ? DRAWER_COLLAPSED : DRAWER_EXPANDED;

  const handleNav = (to: string) => {
    navigate(to);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/login");
  };

  const sidebarContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      {/* Logo header */}
      <Toolbar sx={{ px: collapsed ? 1.5 : 2.5, py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
          <Box
            component="img"
            src="/logo-transport-crop.png"
            alt="Transport Care"
            sx={{
              width: collapsed ? 32 : 36,
              height: collapsed ? 32 : 36,
              objectFit: "contain",
              flexShrink: 0,
              transition: (theme) =>
                theme.transitions.create(["width", "height"], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.standard,
                }),
            }}
          />
          {!collapsed && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "primary.dark",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              Transport Care
            </Typography>
          )}
        </Box>
      </Toolbar>
      <Divider />

      {/* Nav items */}
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.to;
          return (
            <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={collapsed ? item.label : ""} placement="right" arrow>
                <ListItemButton
                  onClick={() => handleNav(item.to)}
                  sx={{
                    borderRadius: 2.5,
                    py: 1.2,
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: collapsed ? 1.5 : 2,
                    bgcolor: active ? "primary.50" : "transparent",
                    color: active ? "primary.dark" : "text.secondary",
                    "&:hover": { bgcolor: "primary.50" },
                    "& .MuiListItemIcon-root": {
                      color: active ? "primary.main" : "text.secondary",
                      minWidth: collapsed ? 0 : 40,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40 }}>{item.icon}</ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontWeight: active ? 700 : 500,
                          fontSize: "0.9rem",
                          whiteSpace: "nowrap",
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* Collapse toggle button */}
      <Box sx={{ p: 1.5, borderTop: "1px solid #e2e8f0" }}>
        <Tooltip title={collapsed ? "Expand menu" : "Collapse menu"} placement="right" arrow>
          <ListItemButton
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              borderRadius: 2.5,
              py: 1.2,
              justifyContent: collapsed ? "center" : "flex-start",
              px: collapsed ? 1.5 : 2,
              color: "text.secondary",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40 }}>
              {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Collapse"
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: 500,
                    fontSize: "0.85rem",
                  },
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  const mobileDrawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ px: 2.5, py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            component="img"
            src="/logo-transport-crop.png"
            alt="Transport Care"
            sx={{
              width: 36,
              height: 36,
              objectFit: "contain",
              flexShrink: 0,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.dark" }}>
            Transport Care
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.to;
          return (
            <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNav(item.to)}
                sx={{
                  borderRadius: 2.5,
                  py: 1.2,
                  bgcolor: active ? "primary.50" : "transparent",
                  color: active ? "primary.dark" : "text.secondary",
                  "&:hover": { bgcolor: "primary.50" },
                  "& .MuiListItemIcon-root": {
                    color: active ? "primary.main" : "text.secondary",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: active ? 700 : 500,
                      fontSize: "0.9rem",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_EXPANDED,
            boxSizing: "border-box",
            borderRight: "1px solid #e2e8f0",
          },
        }}
      >
        {mobileDrawerContent}
      </Drawer>

      {/* Desktop drawer (collapsible) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
          width: drawerWidth,
          flexShrink: 0,
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #e2e8f0",
            overflowX: "hidden",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
          },
        }}
        open
      >
        {sidebarContent}
      </Drawer>

      {/* Main content */}
      <Box
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "#fff",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Toolbar sx={{ gap: 1 }}>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { lg: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "primary.main",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                }}
              >
                {(user?.name ?? "U").charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={!!anchorEl}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem disabled sx={{ opacity: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user?.name ?? "User"}
                </Typography>
              </MenuItem>
              <MenuItem disabled sx={{ opacity: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {user?.username}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Keluar
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: { xs: 2, md: 3 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Container maxWidth="xl" disableGutters>
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
