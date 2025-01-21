import express from 'express';
import dotenv from 'dotenv';
import productRouter from './Routes/product.router.js'
import cors from 'cors';
import connectDB from './db/connectDB.js';
import userRouter from "./Routes/user.router.js"
import cartRouter from "./Routes/cart.router.js"
import paymentRouetr from './Routes/payment.router.js'


// Load environment variables from .env file
const app = express();
dotenv.config();
app.use(express.json())

app.use(cors({
    origin:true,
    methods:[ "GET","POST","PUT","DELETE"],
    credentials:true
  }))

// product router
app.use('/api/product', productRouter);

// user router
app.use('/api/user',userRouter);

// cart router
app.use('/api/cart',cartRouter);

// payment router
app.use('/api/payment',paymentRouetr)


// MongoDB connection
connectDB(); 

const port =  process.env.PORT ;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
