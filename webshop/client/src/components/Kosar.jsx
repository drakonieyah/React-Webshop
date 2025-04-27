import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const Kosar = ({ open, onClose, kosar, setKosar }) => {
  // Add a fallback for kosar to prevent errors
  const osszeg = (kosar || []).reduce((total, item) => total + (item.price * item.mennyiseg), 0);

  // Remove an item from the cart
  const termekTorles = (id) => {
    const ujKosar = kosar.filter((item) => item._id !== id);
    setKosar(ujKosar);
    localStorage.setItem('kosar', JSON.stringify(ujKosar)); // Sync with local storage
  };

  // Adjust the quantity of an item
  const mennyisegValtoztat = (id, valtozas) => {
    const ujKosar = kosar.map((item) => {
      if (item._id === id) {
        const ujMennyiseg = item.mennyiseg + valtozas;
        return { ...item, mennyiseg: ujMennyiseg > 0 ? ujMennyiseg : 1 };
      }
      return item;
    });
    setKosar(ujKosar);
    localStorage.setItem('kosar', JSON.stringify(ujKosar)); // Sync with local storage
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '500px' },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Kosár tartalma
        </Typography>

        {kosar.length === 0 ? (
          <Typography variant="body1">A kosarad üres.</Typography>
        ) : (
          <>
            <List>
              {kosar.map((item) => (
                <React.Fragment key={item._id}>
                  <ListItem>
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.price} Ft/db`}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton onClick={() => mennyisegValtoztat(item._id, -1)}>
                        -
                      </IconButton>
                      <Typography>{item.mennyiseg}</Typography>
                      <IconButton onClick={() => mennyisegValtoztat(item._id, 1)}>
                        +
                      </IconButton>
                      <IconButton onClick={() => termekTorles(item._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>

            <Typography variant="h6" sx={{ textAlign: 'right', marginTop: '10px' }}>
              Összesen: <strong>{osszeg} Ft</strong>
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '10px' }}>
              <Button variant="outlined" onClick={onClose}>
                Vissza
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/rendeles"
                onClick={onClose}
              >
                Tovább a rendeléshez
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default Kosar;