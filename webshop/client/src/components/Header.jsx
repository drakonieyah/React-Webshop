import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Badge, Paper, Button, Fab } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../App';
import Kosar from './Kosar';

const Header = ({ kosar, setKosar }) => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const [nyitottKosar, setNyitottKosar] = useState(false);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const kosarOsszeg = (kosar || []).reduce((sum, item) => sum + item.mennyiseg, 0);

  // Show FAB only if admin and not on /admin
  const showAdminFab = user && user.role && location.pathname !== '/admin';

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          margin: '10px 20px',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <AppBar position="static" sx={{ backgroundColor: darkMode ? '#1f1f1f' : '#1976d2' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Left: Logo and Theme Switch */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{ textDecoration: 'none', color: '#fff', mr: 1 }}
              >
                MC Isti Webshop
              </Typography>
              <IconButton onClick={handleThemeToggle} color="inherit" sx={{ ml: 0 }}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>

            {/* Center: Greeting */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              {user && (
                <Typography
                  variant="body1"
                  sx={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    letterSpacing: 1,
                  }}
                >
                  Üdv, {user.firstName || 'Felhasználó'}!
                </Typography>
              )}
            </Box>

            {/* Right: Cart, Auth Buttons, Profile, Logout */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit" onClick={() => setNyitottKosar(true)}>
                <Badge badgeContent={kosarOsszeg} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              {user && (
                <IconButton color="inherit" component={Link} to="/profil-adatok" sx={{ ml: 1 }}>
                  <SettingsIcon />
                </IconButton>
              )}
              {user ? (
                <Button
                  onClick={handleLogout}
                  sx={{
                    backgroundColor: darkMode ? '#e53935' : '#d32f2f',
                    color: '#fff',
                    mx: 1,
                    px: 2,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    boxShadow: 2,
                    '&:hover': {
                      backgroundColor: darkMode ? '#d32f2f' : '#e53935',
                    },
                  }}
                  variant="contained"
                >
                  Kijelentkezés
                </Button>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    sx={{
                      backgroundColor: darkMode ? '#ff9800' : '#fb8c00',
                      color: '#fff',
                      mx: 1,
                      px: 2,
                      borderRadius: 2,
                      fontWeight: 'bold',
                      boxShadow: 2,
                      '&:hover': {
                        backgroundColor: darkMode ? '#fb8c00' : '#ff9800',
                      },
                    }}
                    variant="contained"
                  >
                    Bejelentkezés
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    sx={{
                      backgroundColor: darkMode ? '#43a047' : '#388e3c',
                      color: '#fff',
                      mx: 1,
                      px: 2,
                      borderRadius: 2,
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: darkMode ? '#388e3c' : '#43a047',
                      },
                    }}
                    variant="contained"
                  >
                    Regisztráció
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </Paper>

      {/* Floating Admin Panel Button */}
      {showAdminFab && (
        <Fab
          color="secondary"
          aria-label="admin"
          onClick={() => navigate('/admin')}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 2000,
            backgroundColor: '#FFD600', // Bright yellow
            color: '#333', // Dark text for contrast
            '&:hover': {
              backgroundColor: '#FFC400', // Slightly darker yellow on hover
            },
          }}
        >
          <AdminPanelSettingsIcon />
        </Fab>
      )}

      <Kosar open={nyitottKosar} onClose={() => setNyitottKosar(false)} kosar={kosar} setKosar={setKosar} />
    </>
  );
};

export default Header;