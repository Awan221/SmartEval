"use client"

import { useState } from "react"
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material"
import { Menu as MenuIcon, Psychology as PsychologyIcon } from "@mui/icons-material"
import { Link as RouterLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const pages = [
  { title: "Accueil", path: "/" },
  { title: "Se connecter", path: "/login", authRequired: false },
  { title: "S'inscrire", path: "/register", authRequired: false },
  { title: "Tableau de bord", path: "/dashboard", authRequired: true },
]

export default function HomeNavbar() {
  const { isAuthenticated, logout } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return
    }
    setDrawerOpen(open)
  }

  const filteredPages = pages.filter((page) => {
    if (page.authRequired === undefined) return true
    return page.authRequired === isAuthenticated
  })

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <PsychologyIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1, color: "primary.main" }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            SmartEval
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer(true)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
                  <PsychologyIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" component="div">
                    SmartEval
                  </Typography>
                </Box>
                <Divider />
                <List>
                  {filteredPages.map((page) => (
                    <ListItem key={page.title} disablePadding>
                      <ListItemButton component={RouterLink} to={page.path}>
                        <ListItemText primary={page.title} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  {isAuthenticated && (
                    <ListItem disablePadding>
                      <ListItemButton onClick={logout}>
                        <ListItemText primary="Se déconnecter" />
                      </ListItemButton>
                    </ListItem>
                  )}
                </List>
              </Box>
            </Drawer>
          </Box>

          {/* Logo for mobile */}
          <PsychologyIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1, color: "primary.main" }} />
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            SmartEval
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "flex-end" }}>
            {filteredPages.map((page) => (
              <Button
                key={page.title}
                component={RouterLink}
                to={page.path}
                sx={{ my: 2, color: "inherit", display: "block" }}
              >
                {page.title}
              </Button>
            ))}
            {isAuthenticated && (
              <Button onClick={logout} sx={{ my: 2, color: "inherit", display: "block" }}>
                Se déconnecter
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

