import express from 'express';
import {
  processPayment,
  paytmResponse,
  getPaymentStatus,
} from '../controllers/paymentController.js';
import { isAuthenticatedUser } from '../middlewares/auth.js';

const router = express.Router();

// Process Payment (Paytm)
router.post('/payment/process', isAuthenticatedUser, (req, res, next) => {
  console.log('Payment process route accessed');
  next();
}, processPayment);

// Paytm callback route (no auth required)
router.post('/callback', (req, res, next) => {
  console.log('Paytm callback received:', req.method, req.originalUrl);
  next();
}, paytmResponse);

// Get Payment Status by Order ID
router.get('/payment/status/:id', isAuthenticatedUser, getPaymentStatus);

export default router;
