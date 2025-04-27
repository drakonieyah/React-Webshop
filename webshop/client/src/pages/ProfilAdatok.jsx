import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Paper, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { ThemeContext } from '../App';

const ProfilAdatok = () => {
  const { darkMode } = useContext(ThemeContext);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipcode: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Track which fields have changed
  const [changedFields, setChangedFields] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setChangedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSave = async () => {
    setError('');
    // Only send fields that have changed and are not empty
    const updatedFields = {};
    Object.keys(formData).forEach((key) => {
      if (changedFields[key] && formData[key].trim() !== '') {
        updatedFields[key] = formData[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      setError('Nincs módosított adat a mentéshez.');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        updatedFields
      );
      // Update localStorage only for changed fields
      const newUser = { ...user, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(newUser));
      setSuccess(true);
      setChangedFields({});
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zipcode: '',
      });
    } catch (err) {
      setError('Hiba történt a mentés során.');
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
          variant="h5"
          sx={{
            mb: 3,
            textAlign: 'center',
            color: darkMode ? '#ffffff' : '#000000',
          }}
        >
          Profil adatok
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Keresztnév"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder={user.firstName || ''}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
          inputProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
        />
        <TextField
          label="Vezetéknév"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder={user.lastName || ''}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
          inputProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={user.email || ''}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
          inputProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
        />
        <TextField
          label="Cím"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder={user.address || ''}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
          inputProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
        />
        <TextField
          label="Város"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder={user.city || ''}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
          inputProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
        />
        <TextField
          label="Irányítószám"
          name="zipcode"
          value={formData.zipcode}
          onChange={handleChange}
          placeholder={user.zipcode || ''}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
          inputProps={{ style: { color: darkMode ? '#ffffff' : '#000000' } }}
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
          onClick={handleSave}
        >
          Mentés
        </Button>

        <Snackbar
          open={success}
          autoHideDuration={2000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Sikeres mentés!
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default ProfilAdatok;