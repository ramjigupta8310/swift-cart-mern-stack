import Cart from '../Models/cart.model.js';

// Add to Cart Controller
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, category, title, description, imgSrc, price, quantity, realPrice, selectedSize } = req.body;

        // Check if user cart already exists
        let cart = await Cart.findOne({ user: userId });

        // Create a new cart if none exists
        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalCartValue: 0, totalCartRealValue: 0 });
        }

        // Check if product already exists in the cart
        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId && item.selectedSize === selectedSize
        );

        // Update quantity and price if product already exists
        if (existingItemIndex >= 0) {
            const item = cart.items[existingItemIndex];
            item.quantity += quantity;
            item.totalProductValue = item.price * item.quantity;
            item.totalProductRealValue = item.realPrice * item.quantity
        } 
        
        // Add new product to the cart
        else {
            // Calculate and update cart totals
            const totalProductValue = price * quantity;
            const totalProductRealValue = realPrice * quantity

            // Push the new product to the cart
            cart.items.push({ productId, category, title, description, imgSrc, price, quantity, totalProductValue, totalProductRealValue, realPrice, selectedSize });
        }


        //  total cart price 
        cart.totalCartValue = cart.items.reduce((total, item) => {
            return total + item.totalProductValue;
        }, 0);

        //  total cart real price 
        cart.totalCartRealValue = cart.items.reduce((total, item) => {
            return total + item.totalProductRealValue;
        }, 0);

        await cart.save(); // Save updated cart to the database

        res.status(200).json({
            message: "Product added to cart successfully",
        });
    } catch (error) {
        console.error("Error in addToCart:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// decrease quantity
export const decreaseQuantity = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId,selectedSize } = req.body;

        // Find the user's cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Check if the product exists in the cart
        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId && item.selectedSize === selectedSize );

        if (existingItemIndex >= 0) {
            const item = cart.items[existingItemIndex];

            // Prevent decreasing quantity below 1
            if (item.quantity <= 1) {
                return res.status(400).json({ message: "Quantity cannot be less than 1" });
            }

            // Decrease the quantity
            item.quantity -= 1;
            item.totalProductValue = item.price * item.quantity;
            item.totalProductRealValue = item.realPrice * item.quantity
        } else {
            return res.status(404).json({ message: "Product not found in the cart" });
        }

        //  total cart price 
        cart.totalCartValue = cart.items.reduce((total, item) => {
            return total + item.totalProductValue;
        }, 0);

        //  total cart real price 
        cart.totalCartRealValue = cart.items.reduce((total, item) => {
            return total + item.totalProductRealValue;
        }, 0);

        // Delete cart if no items left
        if (cart.items.length === 0) {
            await Cart.deleteOne({ user: userId });
            return res.status(200).json({ message: "Cart is empty and has been deleted" });
        }

        await cart.save(); // Save the updated cart

        res.status(200).json({
            message: "Quantity decreased successfully",
            cart,
        });
    } catch (error) {
        console.error("Error in decreaseQuantity:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// increase quantity
export const increaseQuantity = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId,selectedSize } = req.body;

        // Find the user's cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Check if the product exists in the cart
        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId && item.selectedSize === selectedSize);

        if (existingItemIndex >= 0) {
            const item = cart.items[existingItemIndex];

            // increase the quantity
            item.quantity += 1;
            item.totalProductValue = item.price * item.quantity;
            item.totalProductRealValue = item.realPrice * item.quantity
        } else {
            return res.status(404).json({ message: "Product not found in the cart" });
        }

        //  total cart price 
        cart.totalCartValue = cart.items.reduce((total, item) => {
            return total + item.totalProductValue;
        }, 0);

        //  total cart real price 
        cart.totalCartRealValue = cart.items.reduce((total, item) => {
            return total + item.totalProductRealValue;
        }, 0);

        await cart.save(); // Save the updated cart

        res.status(200).json({
            message: "Quantity increased successfully",
            cart,
        });
    } catch (error) {
        console.error("Error in increaseQuantity:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// remove product from cart
export const removeProduct = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId,selectedSize } = req.body;

        // Find the user's cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the index of the product in the cart
        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId && item.selectedSize === selectedSize);

        if (existingItemIndex >= 0) {
            // Remove the product from the cart
            cart.items.splice(existingItemIndex, 1);

            // If no items left, delete the cart
            if (cart.items.length === 0) {
                await Cart.deleteOne({ user: userId });
                return res.status(200).json({ message: "All products removed, cart deleted successfully" });
            }

            //  Update total cart value
            cart.totalCartValue = cart.items.reduce((total, item) => total + item.totalProductValue, 0);

            //  Update total real cart value
            cart.totalCartRealValue = cart.items.reduce((total, item) => total + item.totalProductRealValue, 0);

            await cart.save(); // Save the updated cart

            res.status(200).json({
                message: "Product removed successfully",
                cart,
            });
        } else {
            return res.status(404).json({ message: "Product not found in the cart" });
        }
    } catch (error) {
        console.error("Error in removeProduct:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// get user cart
export const getUserCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find the cart of the user by userId
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({
            message: "User cart fetched successfully",
            cart
        });
    } catch (error) {
        console.error("Error in getUserCart:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// clear user cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find the user's cart
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Clear the items array and reset total price
        cart.items = [];
        cart.totalCartValue = 0;
        cart.totalCartRealValue = 0;

        // Save the updated cart
        await cart.save();

        // After clearing the cart, delete it from the database
        await cart.deleteOne(); 

        res.status(200).json({
            message: "Cart cleared successfully",
            cart
        });
    } catch (error) {
        console.error("Error in clearCart:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
