import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose';
import authRoutes from './routes/auth.route.js';


dotenv.config(); // Load environment variables from .env file

const app = express();

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to MongoDB")
})
    .catch((err) => {
        console.log("Error connecting to MongoDB:", err);
    })



app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies



app.use('/auth', authRoutes);


app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false, //this is telling the client that the request was not successful
        statusCode,
        message,
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})