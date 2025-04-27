import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getImageUrl } from '../utils/getImageUrl';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  Modal,
  IconButton
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Ertekeles from './Ertekeles';
import axios from 'axios';

const Termek = ({ kosar, setKosar }) => {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [termek, setTermek] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then((response) => setTermek(response.data))
      .catch((error) => console.error('Failed to fetch product:', error));
  }, [id]);

  const kosarbaTesz = () => {
    const savedKosar = [...kosar];
    const letezoIndex = savedKosar.findIndex((item) => item._id === termek._id);

    if (letezoIndex >= 0) {
      savedKosar[letezoIndex].mennyiseg += 1;
    } else {
      savedKosar.push({ ...termek, mennyiseg: 1 });
    }

    setKosar(savedKosar);
    localStorage.setItem('kosar', JSON.stringify(savedKosar));

    setMessage(`${termek.name} kosárba téve!`);
    setTimeout(() => setMessage(''), 3000);
  };

  if (!termek) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">Termék betöltése...</Typography>
      </Box>
    );
  }

  // Use images array if present, else fallback to single image
  const images = termek.images && termek.images.length > 0
    ? termek.images.map(img => getImageUrl(img))
    : [termek.image || 'https://via.placeholder.com/150'];

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
      {/* Temporary Message */}
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

      <Card sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Product Images */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img
            src={images[modalIndex]}
            alt={termek.name}
            style={{
              width: 300,
              height: 300,
              objectFit: 'cover',
              borderRadius: 8,
              cursor: images.length > 0 ? 'pointer' : 'default',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
            }}
            onClick={() => {
              setModalOpen(true);
              setZoom(false);
            }}
          />
          {/* Thumbnails */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                style={{
                  width: 50,
                  height: 50,
                  objectFit: 'cover',
                  borderRadius: 4,
                  border: modalIndex === idx ? '2px solid #1976d2' : '1px solid #ccc',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setModalIndex(idx);
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Product Details */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4">{termek.name}</Typography>
          <Typography variant="h5" sx={{ my: 2 }}>{termek.price} Ft</Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 1 }}>Készlet: {termek.stock} db</Typography>
          <Typography paragraph>{termek.description}</Typography>
          
          {/* Disable the button if the product is out of stock */}
          <Button
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            onClick={kosarbaTesz}
            disabled={termek.stock === 0}
            sx={{
              mt: 2,
              backgroundColor: termek.stock === 0 ? '#9e9e9e' : '#1976d2',
              color: '#fff',
              '&:hover': {
                backgroundColor: termek.stock === 0 ? '#9e9e9e' : '#1565c0',
              },
            }}
          >
            {termek.stock === 0 ? 'Nincs készleten' : 'Kosárba'}
          </Button>
        </Box>
      </Card>

      {/* Image Modal Viewer */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setZoom(false); }}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={() => { setModalOpen(false); setZoom(false); }}
        >
          {/* Left Arrow */}
          {images.length > 1 && (
            <IconButton
              sx={{ position: 'absolute', left: 40, color: '#fff', zIndex: 2100 }}
              onClick={e => { e.stopPropagation(); setModalIndex((modalIndex - 1 + images.length) % images.length); setZoom(false); }}
            >
              <ArrowBackIosNewIcon fontSize="large" />
            </IconButton>
          )}
          {/* Image */}
          <Box
            sx={{
              maxWidth: zoom ? '90vw' : 600,
              maxHeight: zoom ? '90vh' : 600,
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: 6,
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={images[modalIndex]}
              alt={`modal-${modalIndex}`}
              style={{
                width: zoom ? '90vw' : 600,
                height: zoom ? '90vh' : 600,
                objectFit: zoom ? 'contain' : 'cover',
                transition: 'all 0.2s',
                cursor: 'zoom-in',
              }}
              onClick={() => setZoom(z => !z)}
            />
            {/* Zoom Button */}
            <IconButton
              sx={{ position: 'absolute', top: 10, right: 10, color: '#fff', background: 'rgba(0,0,0,0.4)' }}
              onClick={e => { e.stopPropagation(); setZoom(z => !z); }}
            >
              <ZoomInIcon />
            </IconButton>
          </Box>
          {/* Right Arrow */}
          {images.length > 1 && (
            <IconButton
              sx={{ position: 'absolute', right: 40, color: '#fff', zIndex: 2100 }}
              onClick={e => { e.stopPropagation(); setModalIndex((modalIndex + 1) % images.length); setZoom(false); }}
            >
              <ArrowForwardIosIcon fontSize="large" />
            </IconButton>
          )}
        </Box>
      </Modal>

      {/* Értékelések és értékelés írása */}
      <Ertekeles termek={termek} />

      <Button component={Link} to="/" sx={{ mt: 4 }}>Vissza a termékekhez</Button>
    </Box>
  );
};

export default Termek;