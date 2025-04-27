import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/getImageUrl';
import { Box, Typography, Button, List, ListItem, IconButton, Divider, TextField, Alert, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const Rendeles = ({ kosar, setKosar }) => {
  const user = JSON.parse(localStorage.getItem('user')); // Check if the user is logged in
  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [currentData, setCurrentData] = useState({}); // Store current profile data
  const [showDeliveryForm] = useState(!user); // Show form if user is not logged in
  const [setErrorFields] = useState([]); // Track which fields are invalid
  const [showErrorMessage, setShowErrorMessage] = useState(false); // Show a single error message
  const [showSnackbar, setShowSnackbar] = useState(false); // Snackbar visibility state

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user && user.email) {
          const response = await axios.get(`http://localhost:5000/api/users/${user.email}`);
          setCurrentData(response.data); // Set current profile data
          setDeliveryInfo({
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            address: response.data.address || '',
            city: response.data.city || '',
            zipCode: response.data.zipCode || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error.response?.data || error.message);
      }
    };
  
    fetchUserData();
  }, [user]); // Dependency array includes `user`

  const handleRendeles = async () => {
    if (showDeliveryForm) {
      const missingFields = [];
      Object.entries(deliveryInfo).forEach(([key, value]) => {
        if (!value) missingFields.push(key);
      });

      if (missingFields.length > 0) {
        setErrorFields(missingFields);
        setShowErrorMessage(true); // Show the error message
        return;
      }
    }

    try {
      // Call backend to deduct stock
      await axios.post('http://localhost:5000/api/products/order', {
        items: kosar.map(item => ({ _id: item._id, mennyiseg: item.mennyiseg }))
      });
  
      setKosar([]); // Clear the cart after order submission
      localStorage.setItem('kosar', JSON.stringify([])); // Sync with local storage
      setShowSnackbar(true); // Show the Snackbar
    } catch (error) {
      alert(error.response?.data?.error || 'Hiba történt a rendelés során.');
    }
  };

  // Update the quantity of an item in the cart
  const mennyisegValtoztat = (id, ujMennyiseg) => {
    const ujKosar = kosar.map((item) => {
      if (item._id === id) {
        const validMennyiseg = Math.min(Math.max(ujMennyiseg, 1), item.stock); // Ensure quantity is between 1 and stock
        return { ...item, mennyiseg: validMennyiseg };
      }
      return item;
    });
    setKosar(ujKosar);
    localStorage.setItem('kosar', JSON.stringify(ujKosar)); // Sync with local storage
  };

  // Remove an item from the cart
  const termekTorles = (id) => {
    const ujKosar = kosar.filter((item) => item._id !== id);
    setKosar(ujKosar);
    localStorage.setItem('kosar', JSON.stringify(ujKosar)); // Sync with local storage
  };

  const osszeg = kosar.reduce((total, item) => total + item.price * item.mennyiseg, 0);

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Rendelés
      </Typography>

      {/* Display current profile data */}
      {user && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">Szállítási adatok:</Typography>
          <Typography>Név: {currentData.firstName} {currentData.lastName}</Typography>
          <Typography>Email: {currentData.email}</Typography>
          <Typography>Cím: {currentData.address}</Typography>
          <Typography>Város: {currentData.city}</Typography>
          <Typography>Irányítószám: {currentData.zipCode}</Typography>
        </Box>
      )}

      {/* Error Message */}
      {showErrorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Kérjük töltsd ki a hiányzó mezőket!
        </Alert>
      )}

      {kosar.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center' }}>
          A kosarad üres.
        </Typography>
      ) : (
        <>
          <List>
            {kosar.map((item) => (
              <React.Fragment key={item._id}>
                <ListItem sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* Product Image */}
                  <img
                    src={
                      item.images && item.images.length > 0
                        ? getImageUrl(item.images[0])
                        : 'https://via.placeholder.com/50'
                    }
                    alt={item.name}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                  />
                  {/* Product Details */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'gray' }}>
                      {item.price} Ft
                    </Typography>
                  </Box>
                  {/* Quantity Input and Delete Button */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      type="number"
                      value={item.mennyiseg}
                      onChange={(e) => mennyisegValtoztat(item._id, parseInt(e.target.value, 10))}
                      inputProps={{
                        min: 1,
                        max: item.stock,
                      }}
                      sx={{ width: '80px' }}
                    />
                    <IconButton onClick={() => termekTorles(item._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>

          {/* Total Price */}
          <Typography variant="h6" sx={{ textAlign: 'right', mt: 2 }}>
            Összesen: <strong>{osszeg} Ft</strong>
          </Typography>

          {/* Submit Order Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button variant="contained" onClick={handleRendeles}>
              Rendelés leadása
            </Button>
          </Box>
        </>
      )}

      {/* Snackbar for success message */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Rendelés sikeresen leadva!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Rendeles;