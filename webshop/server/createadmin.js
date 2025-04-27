const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Adjust the path if necessary

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://drakonieyah:8HbuZaTr1lhn0x0r@mccluster.9gtdcui.mongodb.net/MCShop_DB?retryWrites=true&w=majority';

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create the admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: hashedPassword,
      address: 'Admin Street 1',
      city: 'Admin City',
      zipCode: 12345,
      role: true, // Set role to true for admin
    });

    // Save the admin user to the database
    await adminUser.save();
    console.log('Admin user created successfully!');
  } catch (error) {
    console.error('Failed to create admin user:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
};

createAdminUser();