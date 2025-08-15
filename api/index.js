import dotenv from 'dotenv';
dotenv.config(); // Move this to be the FIRST thing


// console.log('GEMINI_API_KEY loaded:', process.env.GEMINI_API_KEY ? 'YES' : 'NO');

import express from 'express';
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose';
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';

const app = express();

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to MongoDB")
})
    .catch((err) => {
        console.log("Error connecting to MongoDB:", err);
    })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})