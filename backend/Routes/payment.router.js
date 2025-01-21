import express from 'express'
import { makePayment } from '../Controller/payment.controller.js'

const router = express.Router();

// checkout payment
router.post('/make-payment', makePayment)

export default router