// filepath: backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    // Unique filename: timestamp-originalname
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Image upload endpoint
router.post('/upload', upload.array('images', 10), (req, res) => {
  // Return URLs for uploaded images
  const urls = req.files.map(file => `/uploads/${file.filename}`);
  res.json({ urls });
});

// Add a new product
router.post('/add', async (req, res) => {
    try {
      console.log('Request Body:', req.body); // Debugging
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.status(201).json({ message: 'Product added successfully!' });
    } catch (error) {
      console.error('Failed to add product:', error);
      res.status(500).json({ error: 'Failed to add product' });
    }
  });

// Get a single product by ID
router.get('/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch product', error });
    }
  });

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, stock, image } = req.body;

    // Validate required fields
    if (!name || !price || !description || stock === undefined) {
      return res.status(400).json({ error: 'Töltse ki az összes mezőt' });
    }

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Helytelen termék ID' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description, stock, image },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'A termék nem található' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Nem sikerült a terméket frissíteni:', error);
    res.status(500).json({ error: 'A termék frissítése sikertelen' });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully!' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Delete multiple products
router.post('/delete', async (req, res) => {
    try {
      const { ids } = req.body;
      await Product.deleteMany({ _id: { $in: ids } });
      res.status(200).json({ message: 'Termékek sikeresen törölve' });
    } catch (error) {
      res.status(500).json({ message: 'A termékek törlése sikertelen', error });
    }
});

// Order processing
router.post('/order', async (req, res) => {
  try {
    const { items } = req.body; // [{ _id, mennyiseg }]
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Nincs termék a rendelésben.' });
    }

    // Check stock and update
    for (const item of items) {
      const product = await Product.findById(item._id);
      if (!product) {
        return res.status(404).json({ error: `A termék nem található: ${item._id}` });
      }
      if (product.stock < item.mennyiseg) {
        return res.status(400).json({ error: `Nincs elég készlet a következő termékből: ${product.name}` });
      }
      product.stock -= item.mennyiseg;
      await product.save();
    }

    res.json({ message: 'Rendelés sikeresen leadva, készlet frissítve!' });
  } catch (error) {
    console.error('Rendelés feldolgozása sikertelen:', error);
    res.status(500).json({ error: 'Rendelés feldolgozása sikertelen.' });
  }
});

module.exports = router;