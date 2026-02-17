import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { registerAdmin, adminLogin } from './src/controllers/adminController.js';
import { createCar, getAllCars, updateCar, deleteCar } from './src/controllers/carController.js';
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() })
import { getAllBookings, getBookingById, changeBookingStatus } from './src/controllers/bookingController.js';
import { authMiddleware } from './src/middleware/auth.js';
import { registerUser, loginUser, getUserProfile, updateUserProfile } from './src/controllers/userController.js';
import { userAuthMiddleware } from './src/middleware/userAuth.js';
import { createBooking, getUserBookings, getBookingDetails, cancelBooking } from './src/controllers/userBookingController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Error logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Admin
app.post('/admin/register', registerAdmin);
app.post('/admin/login', adminLogin);

// User Auth
app.post('/auth/register', registerUser);
app.post('/auth/login', loginUser);
app.get('/user/profile', userAuthMiddleware, getUserProfile);
app.put('/user/profile', userAuthMiddleware, updateUserProfile);

// Car 
app.post('/cars', authMiddleware, upload.array('images', 6), createCar);
app.get('/cars', getAllCars);
app.put('/cars/:id', authMiddleware, upload.array('images', 6), updateCar);
app.delete('/cars/:id', authMiddleware, deleteCar);

// User Bookings
app.post('/user/bookings', userAuthMiddleware, createBooking);
app.get('/user/bookings', userAuthMiddleware, getUserBookings);
app.get('/user/bookings/:bookingId', userAuthMiddleware, getBookingDetails);
app.patch('/user/bookings/:bookingId/cancel', userAuthMiddleware, cancelBooking);

// Booking 
app.get('/bookings', authMiddleware, getAllBookings);
app.get('/bookings/:id', authMiddleware, getBookingById);
app.patch('/bookings/:id/status', authMiddleware, changeBookingStatus);

app.get('/', (req, res) => res.send('Car Booking API running'));

// Error handler FIRST, then 404 handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  return res.status(err.status || 500).json({ 
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.toString() : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const server = app.listen(PORT, () => {
	console.log(`✓ Server listening on port ${PORT}`);
	console.log('Server is ready for requests');
});

// Prevent exit
process.stdin.resume();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n✓ Shutting down gracefully...');
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('✗ Uncaught Exception:', err);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('✗ Unhandled Rejection at:', promise, 'reason:', reason);
});

