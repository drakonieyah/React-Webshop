import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Alert, IconButton, InputAdornment, Grid, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

const Register = () => {
  const { darkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.address ||
      !formData.city ||
      !formData.zipCode
    ) {
      setErrorMessage('Kérjük, töltsd ki az összes mezőt!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('A jelszavak nem egyeznek!');
      return;
    }

    axios
      .post('http://localhost:5000/api/users/register', formData)
      .then(() => {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.message || 'Hiba történt a regisztráció során.');
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 600,
        margin: 'auto',
        backgroundColor: darkMode ? '#121212' : '#f9f9f9',
        color: darkMode ? '#ffffff' : '#000000',
        borderRadius: 2,
        boxShadow: 3,
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
        Regisztráció
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

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Keresztnév"
            fullWidth
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            onKeyDown={handleKeyDown}
            InputLabelProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
                '&:hover fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
                '&.Mui-focused fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
              },
              input: { color: darkMode ? '#ffffff' : '#000000' },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Vezetéknév"
            fullWidth
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            onKeyDown={handleKeyDown}
            InputLabelProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
                '&:hover fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
                '&.Mui-focused fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
              },
              input: { color: darkMode ? '#ffffff' : '#000000' },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onKeyDown={handleKeyDown}
            InputLabelProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
                '&:hover fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
                '&.Mui-focused fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
              },
              input: { color: darkMode ? '#ffffff' : '#000000' },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
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
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
                '&:hover fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
                '&.Mui-focused fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
              },
              input: { color: darkMode ? '#ffffff' : '#000000' },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Jelszó megerősítése"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
                '&:hover fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
                '&.Mui-focused fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
              },
              input: { color: darkMode ? '#ffffff' : '#000000' },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Irányítószám"
            fullWidth
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
            onKeyDown={handleKeyDown}
            InputLabelProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
                '&:hover fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
                '&.Mui-focused fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
              },
              input: { color: darkMode ? '#ffffff' : '#000000' },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            label="Város"
            fullWidth
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            onKeyDown={handleKeyDown}
            InputLabelProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
                '&:hover fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
                '&.Mui-focused fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
              },
              input: { color: darkMode ? '#ffffff' : '#000000' },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Cím"
            fullWidth
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            onKeyDown={handleKeyDown}
            InputLabelProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
                '&:hover fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
                '&.Mui-focused fieldset': { borderColor: darkMode ? '#ffffff' : '#000000' },
              },
              input: { color: darkMode ? '#ffffff' : '#000000' },
            }}
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        fullWidth
        sx={{
          mt: 3,
          backgroundColor: darkMode ? '#1976d2' : '#1565c0',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: darkMode ? '#1565c0' : '#0d47a1',
          },
        }}
        onClick={handleRegister}
      >
        Regisztráció
      </Button>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Sikeres regisztráció!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;