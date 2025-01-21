import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import CartContext from './CartContext';
import UserContext from './UserContext';

const CartState = ({ children }) => {
    const { isAuthenticated, setIsAuthenticated } = useContext(UserContext);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [cart, setCart] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            const storedToken = localStorage.getItem('token');
            setToken(storedToken);
        } else {
            setToken(null); // Clear token if logged out
        }
    }, [isAuthenticated]);

    useEffect(() => {
        getUserCart();
    }, [token]);


    const axiosInstance = axios.create({
        baseURL: 'https://swift-cart-mern-stack-backend.onrender.com/api',
        headers: {
            Authorization: token,
        },
    });

    // Get User Cart API call
    const getUserCart = async () => {
        if (!isAuthenticated) {
            return;
        }
        try {
            const response = await axiosInstance.get('/cart/get-user-cart');
            setCart(response.data.cart);

        } catch (error) {
            if (error.response.status === 404) {
                setCart([]); // Set cart to empty if 404 error occurs
            }
            return error;
        }
    };

    // Add Product to Cart API call
    const addToCart = async (productData) => {
        try {
            const response = await axiosInstance.post('/cart/add', productData);
            await getUserCart(); // Fetch the updated cart after adding product
            return response.data;
        } catch (error) {
            setIsAuthenticated(false);
            throw error;
        }
    };

    // Decrease Quantity API call
    const decreaseQuantity = async (productId, selectedSize) => {
        try {
            const response = await axiosInstance.post('/cart/decrease-quantity', { productId, selectedSize });
            await getUserCart(); // Fetch the updated cart after decreasing quantity
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const increaseQuantity = async (productId, selectedSize) => {
        try {
            const response = await axiosInstance.post('/cart/increase-quantity', { productId, selectedSize });
            await getUserCart(); // Fetch the updated cart after decreasing quantity
            return response.data;
        } catch (error) {
            return error;
        }
    };

    // Remove Product from Cart API call
    const removeProduct = async (productId, selectedSize) => {
        try {
            const response = await axiosInstance.post('/cart/remove-product', { productId, selectedSize });
            await getUserCart(); // Fetch the updated cart after removing product
            return response.data;
        } catch (error) {
            return error;
        }
    };

    // Clear Cart API call
    const clearCart = async () => {
        try {
            const response = await axiosInstance.post('/cart/clear-cart');
            await getUserCart(); // Fetch the updated cart after clearing the cart
            return response.data;
        } catch (error) {
            return error;
        }
    };

    return (
        <CartContext.Provider
            value={{
                getUserCart,
                addToCart,
                decreaseQuantity,
                increaseQuantity,
                removeProduct,
                clearCart,
                cart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartState;
