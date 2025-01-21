import express from 'express';
import { addToCart, clearCart, decreaseQuantity, getUserCart, increaseQuantity, removeProduct } from '../Controller/cart.controller.js';
import authenticateUser from '../Middlewares/auth.Middleware.js'

const router = express.Router();
// add to cart
router.post('/add', authenticateUser, addToCart);

// decrease product quantity from cart
router.post('/decrease-quantity', authenticateUser, decreaseQuantity);

// increase product quantity from cart
router.post('/increase-quantity', authenticateUser, increaseQuantity);

// remove product from cart
router.post('/remove-product', authenticateUser, removeProduct);

// get user cart
router.get('/get-user-cart', authenticateUser, getUserCart);

// clear user cart
router.post('/clear-cart', authenticateUser, clearCart);

export default router;
