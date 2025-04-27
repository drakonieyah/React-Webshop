import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Alert, IconButton, InputAdornment, Snackbar, Paper } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

const Login = () => {
  const { darkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = () => {
    if (!formData.email || !formData.password) {
      setErrorMessage('Kérjük, töltsd ki az összes mezőt!');
      return;
    }

    axios
      .post('http://localhost:5000/api/users/login', formData)
      .then((response) => {
        localStorage.setItem('user', JSON.stringify(response.data));
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.error || 'Hibás email vagy jelszó!');
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: darkMode
          ? 'linear-gradient(135deg, #23272b 0%, #121212 100%)'
          : 'linear-gradient(135deg, #1976d2 0%, #90caf9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 4 },
          width: { xs: '100%', sm: 400 },
          maxWidth: '100%',
          borderRadius: 3,
          boxShadow: 6,
          backgroundColor: darkMode ? '#121212' : '#f9f9f9',
          color: darkMode ? '#fff' : '#000',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            textAlign: 'center',
            color: darkMode ? '#ffffff' : '#000000',
          }}
        >
          Bejelentkezés
        </Typography>

        {errorMessage && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              backgroundColor: darkMode ? '#333333' : '#f9f9f9',
              color: darkMode ? '#ffffff' : '#000000',
            }}
          >
            {errorMessage}
          </Alert>
        )}

        <TextField
          label="Email"
          type="email"
          fullWidth
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          onKeyDown={handleKeyDown}
          InputLabelProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
              '&:hover fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
              '&.Mui-focused fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
            },
            input: { color: darkMode ? '#ffffff' : '#000000' },
          }}
        />

        <TextField
          label="Jelszó"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          onKeyDown={handleKeyDown}
          InputLabelProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
              '&:hover fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
              '&.Mui-focused fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
            },
            input: { color: darkMode ? '#ffffff' : '#000000' },
          }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            py: 1.2,
            fontWeight: 'bold',
            fontSize: '1rem',
            backgroundColor: darkMode ? '#1976d2' : '#1565c0',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: darkMode ? '#1565c0' : '#0d47a1',
            },
          }}
          onClick={handleLogin}
        >
          Bejelentkezés
        </Button>

        {/* Success Snackbar */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={2000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Sikeres bejelentkezés!
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default Login;