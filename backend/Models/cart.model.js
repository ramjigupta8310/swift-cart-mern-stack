import mongoose from 'mongoose';
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            }, 
            category: {
                type: String,
                required: true
            }, 
            title: { type: String, required: true }, 
            description: { type: String }, 
            imgSrc: { type: String },
            price: { type: Number, required: true }, 
            realPrice:{ type: Number, required: true },
            totalProductValue: { type: Number, required: true },
            totalProductRealValue:{ type: Number, required: true },
            quantity: { type: Number, required: true, min: 1 },
            selectedSize:{ type: String }
        }
    ],
    totalCartValue: { type: Number, required: true }, 
    totalCartRealValue: { type: Number, required: true }, 
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema, 'user-cart');
export default Cart;
