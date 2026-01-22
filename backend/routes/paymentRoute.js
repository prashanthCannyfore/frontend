import express from 'express';
import {
  processPayment,
  paytmResponse,
  getPaymentStatus,
} from '../controllers/paymentController.js';
import { isAuthenticatedUser } from '../middlewares/auth.js';

const router = express.Router();

// Process Payment (Paytm)
router.post('/payment/process', isAuthenticatedUser, processPayment);

// Paytm callback route
router.post('/callback', paytmResponse);

// Get Payment Status by Order ID
router.get('/payment/status/:id', isAuthenticatedUser, getPaymentStatus);

export default router;
