import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Stack,
  Divider
} from '@mui/material';
import axios from 'axios';

const Ertekeles = ({ termek, onClose, modalOnly }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [ertekeles, setErtekeles] = useState({
    nev: '',
    csillag: 3,
    szoveg: ''
  });
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/product/${termek._id}`);
      setReviews(res.data);
    } catch {
      setReviews([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!modalOnly) fetchReviews();
    setOpen(false);
    setError('');
    setErtekeles({ nev: '', csillag: 3, szoveg: '' });
    // eslint-disable-next-line
  }, [termek._id, modalOnly]);

  // Submit review
  const kuldes = async () => {
    if (!user && !ertekeles.nev) {
      setError('Név megadása kötelező vendégként!');
      return;
    }
    if (!ertekeles.szoveg) {
      setError('Vélemény szövege kötelező!');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/reviews', {
        product: termek._id,
        user: user ? user._id : undefined,
        guestName: !user ? ertekeles.nev : undefined,
        rating: ertekeles.csillag,
        text: ertekeles.szoveg
      });
      setError('');
      setErtekeles({ nev: '', csillag: 3, szoveg: '' });
      if (modalOnly) {
        if (onClose) onClose();
      } else {
        setOpen(false);
        fetchReviews();
      }
    } catch (e) {
      setError('Hiba történt az értékelés mentésekor.');
    }
  };

  // Handle closing the modal
  const handleClose = () => {
    setOpen(false);
    setError('');
    setErtekeles({ nev: '', csillag: 3, szoveg: '' });
    if (modalOnly && onClose) onClose();
  };

  // Modal content (shared)
  const modalContent = (
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: { xs: '90%', sm: '500px' },
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: '8px'
    }}>
      <Typography variant="h5" gutterBottom>
        Értékelés: {termek.name}
      </Typography>

      <Stack spacing={2}>
        {!user && (
          <TextField
            label="Neved (kötelező vendégként)"
            value={ertekeles.nev}
            onChange={(e) => setErtekeles({ ...ertekeles, nev: e.target.value })}
            fullWidth
          />
        )}

        <Box>
          <Typography component="legend">Értékelés</Typography>
          <Rating
            value={ertekeles.csillag}
            onChange={(e, ujErtek) => setErtekeles({ ...ertekeles, csillag: ujErtek })}
          />
        </Box>

        <TextField
          label="Véleményed"
          multiline
          rows={4}
          value={ertekeles.szoveg}
          onChange={(e) => setErtekeles({ ...ertekeles, szoveg: e.target.value })}
          fullWidth
        />

        {error && <Typography color="error">{error}</Typography>}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button variant="outlined" onClick={handleClose}>
            Mégse
          </Button>
          <Button variant="contained" onClick={kuldes}>
            Küldés
          </Button>
        </Box>
      </Stack>
    </Box>
  );

  // If modalOnly, always show modal
  if (modalOnly) {
    return (
      <Modal open={true} onClose={handleClose}>
        {modalContent}
      </Modal>
    );
  }

  // Otherwise, show review list and "Értékelés írása" button
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Értékelések</Typography>
      {loading ? (
        <Typography>Betöltés...</Typography>
      ) : reviews.length === 0 ? (
        <Typography>Nincsenek még értékelések.</Typography>
      ) : (
        reviews.map(r => (
          <Box key={r._id} sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography fontWeight="bold">
                {r.user ? `${r.user.firstName} ${r.user.lastName}` : r.guestName || 'Vendég'}
              </Typography>
              <Rating value={r.rating} readOnly size="small" />
              <Typography variant="caption" color="text.secondary">
                {new Date(r.createdAt).toLocaleDateString()}
              </Typography>
            </Stack>
            <Typography sx={{ ml: 1 }}>{r.text}</Typography>
            <Divider sx={{ mt: 1 }} />
          </Box>
        ))
      )}

      <Button
        variant="outlined"
        sx={{
          mt: 2,
          color: '#1976d2',
          borderColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#e3f2fd',
            borderColor: '#1565c0',
          },
        }}
        onClick={() => setOpen(true)}
      >
        Értékelés írása
      </Button>

      <Modal open={open} onClose={handleClose}>
        {modalContent}
      </Modal>
    </Box>
  );
};

export default Ertekeles;