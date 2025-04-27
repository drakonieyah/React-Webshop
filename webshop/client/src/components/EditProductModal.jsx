import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const EditProductModal = ({ open, onClose, product, onSave }) => {
  const [editedProduct, setEditedProduct] = useState(product);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (product) {
      setEditedProduct(product);
    } else {
      setEditedProduct({
        name: '',
        price: 0,
        description: '',
        stock: 0,
        images: [''],
      });
    }
  }, [product]);

  const handleSave = () => {
    axios
      .put(`http://localhost:5000/api/products/${editedProduct._id}`, {
        ...editedProduct,
        images: (editedProduct.images || []).filter(Boolean), // Remove empty strings
      })
      .then(() => {
        setShowSnackbar(true);
        onSave();
        onClose();
      })
      .catch((error) => {
        console.error('Failed to update product:', error);
        alert('Failed to update product.');
      });
  };

  if (!editedProduct) return null;

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '400px' },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: '20px' }}>
            Edit Product
          </Typography>
          <TextField
            label="Name"
            value={editedProduct.name || ''}
            onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
            fullWidth
            sx={{ marginBottom: '20px' }}
          />
          <TextField
            label="Price"
            type="number"
            value={editedProduct.price || ''}
            onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
            fullWidth
            sx={{ marginBottom: '20px' }}
          />
          <TextField
            label="Description"
            value={editedProduct.description || ''}
            onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
            fullWidth
            sx={{ marginBottom: '20px' }}
          />
          <TextField
            label="Stock"
            type="number"
            value={editedProduct.stock || ''}
            onChange={(e) => setEditedProduct({ ...editedProduct, stock: e.target.value })}
            fullWidth
            sx={{ marginBottom: '20px' }}
          />
          <Typography variant="subtitle1" sx={{ mt: 1 }}>Képek (URL):</Typography>
          {(editedProduct.images || ['']).map((url, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                label={`Kép #${idx + 1}`}
                value={url}
                onChange={e => {
                  const images = [...(editedProduct.images || [''])];
                  images[idx] = e.target.value;
                  setEditedProduct({ ...editedProduct, images });
                }}
                fullWidth
              />
              <Button
                onClick={() => {
                  const images = (editedProduct.images || ['']).filter((_, i) => i !== idx);
                  setEditedProduct({ ...editedProduct, images });
                }}
                disabled={(editedProduct.images || ['']).length === 1}
                sx={{ ml: 1 }}
              >
                Törlés
              </Button>
            </Box>
          ))}
          <Button
            onClick={() =>
              setEditedProduct({
                ...editedProduct,
                images: [...(editedProduct.images || ['']), ''],
              })
            }
            sx={{ mb: 2 }}
          >
            + Kép hozzáadása
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Termék adatai sikeresen frissítve!
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditProductModal;