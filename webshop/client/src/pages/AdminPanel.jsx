import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Tabs, Tab, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { ThemeContext } from '../App';
import { getImageUrl } from '../utils/getImageUrl';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditProductModal from '../components/EditProductModal';

const AdminPanel = () => {
  const [createSnackbarOpen, setCreateSnackbarOpen] = useState(false);
  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [termekek, setTermekek] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [felhasznalok, setFelhasznalok] = useState([]);
  const [ujTermek, setUjTermek] = useState({ nev: '', leiras: '', ar: '', kepek: [''], keszlet: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    fetchTermekek();
    fetchFelhasznalok();
  }, []);

  const fetchTermekek = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setTermekek(response.data);
    } catch (error) {
      console.error('Nem sikerült lekérni a termékeket:', error);
    }
  };

  const fetchFelhasznalok = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setFelhasznalok(response.data);
    } catch (error) {
      console.error('Nem sikerült lekérni a felhasználókat:', error);
    }
  };

  const handleUjTermek = async () => {
    try {
      let imageUrls = [];
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('images', file));
        const res = await axios.post('http://localhost:5000/api/products/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrls = res.data.urls;
      }
      const newProduct = {
        name: ujTermek.nev,
        description: ujTermek.leiras,
        price: parseFloat(ujTermek.ar),
        images: imageUrls.length > 0 ? imageUrls : ujTermek.kepek.filter(Boolean),
        stock: parseInt(ujTermek.keszlet, 10),
      };
      await axios.post('http://localhost:5000/api/products/add', newProduct);
      fetchTermekek();
      setUjTermek({ nev: '', leiras: '', ar: '', kepek: [''], keszlet: '' });
      setSelectedFiles([]);
      setCreateSnackbarOpen(true);
    } catch (error) {
      console.error('Nem sikerült létrehozni az új terméket:', error);
    }
  };

  const handleTermekTorles = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setDeleteSnackbarOpen(true);
      fetchTermekek();
    } catch (error) {
      console.error('Nem sikerült törölni a terméket:', error);
    }
  };

  const handleFelhasznaloTorles = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchFelhasznalok();
    } catch (error) {
      console.error('Nem sikerült törölni a felhasználót:', error);
    }
  };

  const handleEditProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  return (
    <Box
      sx={{
        backgroundColor: darkMode ? '#121212' : '#f5f5f5',
        color: darkMode ? '#fff' : '#000',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px',
        }}
      >
        <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: '20px' }}>
          Admin Panel
        </Typography>
        <Tabs
          value={tabIndex}
          onChange={(e, newValue) => setTabIndex(newValue)}
          centered
          variant="fullWidth"
          textColor={darkMode ? 'secondary' : 'primary'}
          indicatorColor={darkMode ? 'secondary' : 'primary'}
        >
          <Tab label="Termékek" />
          <Tab label="Felhasználók" />
        </Tabs>

        {/* Termékek Tab */}
        {tabIndex === 0 && (
          <Box
            sx={{
              marginTop: '20px',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              alignItems: { xs: 'stretch', md: 'flex-start' },
            }}
          >
            {/* Új termék létrehozása */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: { xs: '100%', md: 400 },
                minWidth: { xs: '100%', md: 320 },
                width: { xs: '100%', md: 'auto' },
                background: darkMode ? '#23272b' : '#fff',
                p: 3,
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <Typography variant="h5" sx={{ marginBottom: '10px' }}>
                Új termék létrehozása
              </Typography>
              <TextField
                label="Név"
                value={ujTermek.nev}
                onChange={(e) => setUjTermek({ ...ujTermek, nev: e.target.value })}
                fullWidth
              />
              <TextField
                label="Leírás"
                value={ujTermek.leiras}
                onChange={(e) => setUjTermek({ ...ujTermek, leiras: e.target.value })}
                fullWidth
              />
              <TextField
                label="Ár"
                type="number"
                value={ujTermek.ar}
                onChange={(e) => setUjTermek({ ...ujTermek, ar: e.target.value })}
                fullWidth
              />
              <TextField
                label="Készlet"
                type="number"
                value={ujTermek.keszlet}
                onChange={(e) => setUjTermek({ ...ujTermek, keszlet: e.target.value })}
                fullWidth
              />

              {/* Kép feltöltés */}
              <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => setSelectedFiles([...e.target.files])}
                  style={{ margin: '10px 0' }}
                />
              {selectedFiles.length > 0 && (
                <img
                  src={URL.createObjectURL(selectedFiles[0])}
                  alt="Előnézet"
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }}
                />
              )}

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Képek (URL):</Typography>
                {ujTermek.kepek.map((url, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TextField
                      label={`Kép #${idx + 1}`}
                      value={url}
                      onChange={e => {
                        const kepek = [...ujTermek.kepek];
                        kepek[idx] = e.target.value;
                        setUjTermek({ ...ujTermek, kepek });
                      }}
                      fullWidth
                    />
                    <Button
                      onClick={() => setUjTermek({ ...ujTermek, kepek: ujTermek.kepek.filter((_, i) => i !== idx) })}
                      disabled={ujTermek.kepek.length === 1}
                      sx={{ ml: 1, minWidth: 0, padding: '6px 8px' }}
                    >
                      Törlés
                    </Button>
                  </Box>
                ))}
                <Button
                  onClick={() => setUjTermek({ ...ujTermek, kepek: [...ujTermek.kepek, ''] })}
                  sx={{ mt: 1 }}
                  variant="outlined"
                >
                  + Kép hozzáadása
                </Button>
              </Box>

              <Button
                variant="contained"
                onClick={handleUjTermek}
                sx={{
                  minWidth: '150px',
                  height: '56px',
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                  mt: 2,
                  alignSelf: 'flex-start'
                }}
              >
                Létrehozás
              </Button>
            </Box>

            {/* Létező termékek */}
            <Box sx={{ flex: 1, width: '100%' }}>
              <Typography variant="h5" sx={{ marginBottom: '10px' }}>
                Létező termékek
              </Typography>
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <TableContainer component={Paper} sx={{ minWidth: 600 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Név</TableCell>
                        <TableCell>Leírás</TableCell>
                        <TableCell>Ár</TableCell>
                        <TableCell>Készlet</TableCell>
                        <TableCell>Műveletek</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {termekek.map((termek) => (
                        <TableRow key={termek._id}>
                          <TableCell>
                            <img
                              src={getImageUrl(termek.images && termek.images[0])}
                              alt={termek.name}
                              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                            />
                          </TableCell>
                          <TableCell>{termek.name}</TableCell>
                          <TableCell>{termek.description}</TableCell>
                          <TableCell>{termek.price} Ft</TableCell>
                          <TableCell>{termek.stock} db</TableCell>
                          <TableCell>
                            <IconButton color="primary" onClick={() => handleEditProductClick(termek)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleTermekTorles(termek._id)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Box>
        )}

        {/* Felhasználók Tab */}
        {tabIndex === 1 && (
          <Box sx={{ marginTop: '20px' }}>
            <Typography variant="h5" sx={{ marginBottom: '10px' }}>
              Létező felhasználók
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Név</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Műveletek</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {felhasznalok.map((felhasznalo) => (
                    <TableRow key={felhasznalo._id}>
                      <TableCell>{`${felhasznalo.firstName} ${felhasznalo.lastName}`}</TableCell>
                      <TableCell>{felhasznalo.email}</TableCell>
                      <TableCell>
                        {!felhasznalo.role && (
                          <IconButton color="error" onClick={() => handleFelhasznaloTorles(felhasznalo._id)}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>

      {/* Edit Product Modal */}
      <EditProductModal
        open={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
        onSave={fetchTermekek}
      />
      <Snackbar
        open={createSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setCreateSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setCreateSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Termék sikeresen létrehozva!
        </Alert>
      </Snackbar>
      <Snackbar
        open={deleteSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setDeleteSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setDeleteSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Termék sikeresen törölve!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPanel;