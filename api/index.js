import dotenv from 'dotenv';
dotenv.config(); // Move this to be the FIRST thing

import express from 'express';
import cors from 'cors'; // Add this import
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose';
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import path from 'path';

const app = express();

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to MongoDB")
})
    .catch((err) => {
        console.log("Error connecting to MongoDB:", err);
    })

const __dirname = path.resolve();

// Add CORS middleware BEFORE other middleware
app.use(cors({
    origin: true, // Allow all origins
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "/client", "dist", "index.html"))
})

app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})