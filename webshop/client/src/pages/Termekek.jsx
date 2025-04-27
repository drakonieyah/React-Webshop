import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Typography, Box } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Ertekeles from '../components/Ertekeles'; // Import the Review modal
import { ThemeContext } from '../App';
import { getImageUrl } from '../utils/getImageUrl';

const Termekek = ({ kosar, setKosar }) => {
  const [termekek, setTermekek] = useState([]);
  const [nyitottTermek, setNyitottTermek] = useState(null);
  const [message, setMessage] = useState('');
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get('http://localhost:5000/api/products')
      .then((response) => {
        setTermekek(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch products:', error);
      });
  };

  const kosarbaTesz = (termek) => {
    if (!termek || !termek._id || !termek.name || !termek.price) {
      console.error('Invalid product data:', termek);
      return;
    }

    const savedKosar = [...kosar];
    const letezoIndex = savedKosar.findIndex((item) => item._id === termek._id);

    if (letezoIndex >= 0) {
      savedKosar[letezoIndex].mennyiseg += 1;
    } else {
      savedKosar.push({ ...termek, mennyiseg: 1 });
    }

    setKosar(savedKosar);
    localStorage.setItem('kosar', JSON.stringify(savedKosar));

    // Set the temporary message
    setMessage(`${termek.name} kosárba téve!`);
    setTimeout(() => setMessage(''), 3000); // Clear the message after 3 seconds
  };

  return (
    <Box
      sx={{
        backgroundColor: darkMode ? '#121212' : '#f5f5f5',
        color: darkMode ? '#fff' : '#000',
        minHeight: '100vh',
      }}
    >
      {/* Visszajelzés */}
      {message && (
        <Box
          sx={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#4caf50',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
          }}
        >
          {message}
        </Box>
      )}

      <Box
        sx={{
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: '20px',
        }}
      >
        {termekek.map((termek) => (
          <Card
          key={termek._id}
          sx={{
            padding: '20px',
            backgroundColor: termek.stock > 0
              ? (darkMode ? '#1f1f1f' : '#fff')
              : (darkMode ? '#23272b' : '#f0f0f0'),
            color: termek.stock > 0
              ? (darkMode ? '#fff' : '#000')
              : (darkMode ? '#888' : '#888'),
            position: 'relative',
            opacity: termek.stock > 0 ? 1 : 0.7,
            filter: termek.stock > 0 ? 'none' : 'grayscale(0.3)',
            transition: 'background 0.2s, color 0.2s, opacity 0.2s',
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <img
              src={
                termek.images && termek.images.length > 0
                  ? getImageUrl(termek.images[0])
                  : 'https://via.placeholder.com/150'
              }
              alt={termek.name}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                filter: termek.stock === 0 ? 'grayscale(0.7) brightness(0.7)' : 'none',
                transition: 'filter 0.2s',
              }}
            />
          </Box>
        
          <Link
            to={`/termek/${termek._id}`}
            style={{ textDecoration: 'none', color: darkMode ? '#90caf9' : '#1976d2' }}
          >
            <Typography variant="h5" sx={{ marginTop: '10px' }}>
              {termek.name}
            </Typography>
          </Link>
          <Typography variant="body1" sx={{ margin: '10px 0' }}>
            {termek.description}
          </Typography>
          <Typography variant="h6">{termek.price} Ft</Typography>
          <Typography
            variant="body2"
            sx={{
              color: termek.stock > 0 ? (darkMode ? '#b2ff59' : '#388e3c') : '#d32f2f',
              fontWeight: 'bold',
              mb: 1,
            }}
          >
            Készlet: {termek.stock} db
          </Typography>
          <Box sx={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <Button
              variant="contained"
              startIcon={<AddShoppingCartIcon />}
              onClick={() => kosarbaTesz(termek)}
              fullWidth
              sx={{
                backgroundColor: '#1976d2',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
              disabled={termek.stock === 0}
            >
              Kosárba
            </Button>
            <Button
              variant="outlined"
              onClick={() => setNyitottTermek(termek)}
              fullWidth
              sx={{
                color: darkMode ? '#90caf9' : '#1976d2',
                borderColor: darkMode ? '#90caf9' : '#1976d2',
              }}
            >
              Értékelés
            </Button>
            {termek.stock === 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: 390,
                  bottom: 18,
                  mx: 'auto',
                  width: '48%',
                  backgroundColor: '#d32f2f',
                  color: '#fff',
                  py: 1,
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  zIndex: 3,
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  letterSpacing: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  pointerEvents: 'none',
                }}
              >
                Kifogyott
              </Box>
            )}
          </Box>
        </Card>
        ))}
      </Box>

      {nyitottTermek && (
          <Ertekeles
            termek={nyitottTermek}
            onClose={() => setNyitottTermek(null)}
            modalOnly={true}
          />
        )}
    </Box>
  );
};

export default Termekek;