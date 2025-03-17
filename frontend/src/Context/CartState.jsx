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
        baseURL: import.meta.env.VITE_BASE_URL,
        headers: {
            Authorization: token,
        },
    });

    // Get User Cart API call
    const getUserCart = async () => {
        if (!isAuthenticated) return;
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

    // Call Api To Add Product
    const addToCart = async (productData) => {
        try {
            await axiosInstance.post('/cart/add', productData);
            // Fetch The Updated Cart After Adding Product
            await getUserCart();
        } catch (error) {
            if (error.response?.status === 401) setIsAuthenticated(false);
            throw error;
        }
    };

    // Decrease Quantity API call
    const decreaseQuantity = async (productId, selectedSize) => {
        try {
            await axiosInstance.post('/cart/decrease-quantity', { productId, selectedSize });
            await getUserCart(); // Fetch The Updated Cart After Decreasing Quantity
        } catch (error) {
            if (error.response?.status === 401) setIsAuthenticated(false);
            throw error;
        }
    };

    // Increase Quantity API call
    const increaseQuantity = async (productId, selectedSize) => {
        try {
            await axiosInstance.post('/cart/increase-quantity', { productId, selectedSize });
            await getUserCart(); // Fetch the updated cart after decreasing quantity
        } catch (error) {
            if (error.response?.status === 401) setIsAuthenticated(false);
            throw error;
        }
    };

    // Remove Product from Cart API call
    const removeProduct = async (productId, selectedSize) => {
        try {
            await axiosInstance.post('/cart/remove-product', { productId, selectedSize });
            await getUserCart(); // Fetch the updated cart after removing product
        } catch (error) {
            if (error.response?.status === 401) setIsAuthenticated(false);
            throw error;
        }
    };

    // Clear Cart API call
    const clearCart = async () => {
        try {
            await axiosInstance.post('/cart/clear-cart');
            await getUserCart(); // Fetch the Updated Cart After Clearing The Cart
        } catch (error) {
            if(error.response?.status === 401) setIsAuthenticated(false);
            throw error;
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
