import Product from "../models/product.model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from '@google/generative-ai';


export const createProduct = async (req, res, next) => {
    try {
        const productData = req.body;

        // Check if product with same name already exists (case-insensitive)
        const existingProduct = await Product.findOne({
            productName: { $regex: new RegExp(`^${productData.productName}$`, 'i') }
        });

        if (existingProduct) {
            return next(errorHandler(400, 'Product with this name already exists'));
        }

        // Add createdBy from authenticated user
        productData.createdBy = req.user.id; // or req.user._id depending on your auth setup

        // Create new product instance
        const product = new Product(productData);

        // Save to database (totalValue will be auto-calculated by pre-save hook)
        const savedProduct = await product.save();

        // Return success response
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: savedProduct
        });

    } catch (error) {
        console.error('Create product error:', error);

        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return next(errorHandler(400, `Product with this ${field} already exists`));
        }

        // Handle validation errors from Mongoose
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors)
                .map(err => `${err.path}: ${err.message}`)
                .join(', ');
            return next(errorHandler(400, `Validation failed: ${errorMessage}`));
        }

        // Handle other errors
        return next(errorHandler(500, 'Failed to create product'));
    }
};


export const getProducts = async (req, res, next) => {
    try {
        console.log('=== CONTROLLER START ===');
        console.log('req.query:', req.query);

        // Manual validation and parsing
        const validationErrors = [];

        // Parse and validate page
        let page = 1;
        if (req.query.page) {
            const parsedPage = parseInt(req.query.page, 10);
            if (isNaN(parsedPage) || parsedPage < 1) {
                validationErrors.push('Page must be a positive integer');
            } else {
                page = parsedPage;
            }
        }

        // Parse and validate limit
        let limit = 10;
        if (req.query.limit) {
            const parsedLimit = parseInt(req.query.limit, 10);
            if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
                validationErrors.push('Limit must be a positive integer between 1 and 100');
            } else {
                limit = parsedLimit;
            }
        }

        // Validate search (optional string)
        const search = req.query.search ? String(req.query.search).trim() : undefined;
        if (search !== undefined && search.length === 0) {
            // Convert empty string to undefined
            search = undefined;
        }

        // Validate category (optional string)
        const category = req.query.category ? String(req.query.category).trim() : undefined;
        if (category !== undefined && category.length === 0) {
            category = undefined;
        }

        // Validate inStock (optional boolean string)
        let inStock = undefined;
        if (req.query.inStock) {
            const inStockStr = String(req.query.inStock).toLowerCase();
            if (inStockStr === 'true') {
                inStock = 'true';
            } else if (inStockStr === 'false') {
                inStock = 'false';
            } else {
                validationErrors.push('inStock must be "true" or "false"');
            }
        }

        // Parse and validate minPrice
        let minPrice = undefined;
        if (req.query.minPrice) {
            const parsedMinPrice = parseFloat(req.query.minPrice);
            if (isNaN(parsedMinPrice) || parsedMinPrice < 0) {
                validationErrors.push('minPrice must be a non-negative number');
            } else {
                minPrice = parsedMinPrice;
            }
        }

        // Parse and validate maxPrice
        let maxPrice = undefined;
        if (req.query.maxPrice) {
            const parsedMaxPrice = parseFloat(req.query.maxPrice);
            if (isNaN(parsedMaxPrice) || parsedMaxPrice < 0) {
                validationErrors.push('maxPrice must be a non-negative number');
            } else {
                maxPrice = parsedMaxPrice;
            }
        }

        // Validate price range
        if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
            validationErrors.push('minPrice cannot be greater than maxPrice');
        }

        // Validate sortBy
        const allowedSortFields = ['createdAt', 'updatedAt', 'productName', 'price', 'category'];
        let sortBy = 'createdAt';
        if (req.query.sortBy) {
            const sortByStr = String(req.query.sortBy);
            if (!allowedSortFields.includes(sortByStr)) {
                validationErrors.push(`sortBy must be one of: ${allowedSortFields.join(', ')}`);
            } else {
                sortBy = sortByStr;
            }
        }

        // Validate sortOrder
        let sortOrder = 'desc';
        if (req.query.sortOrder) {
            const sortOrderStr = String(req.query.sortOrder).toLowerCase();
            if (!['asc', 'desc'].includes(sortOrderStr)) {
                validationErrors.push('sortOrder must be "asc" or "desc"');
            } else {
                sortOrder = sortOrderStr;
            }
        }

        // Validate createdBy (optional string - should be valid ObjectId if provided)
        const createdBy = req.query.createdBy ? String(req.query.createdBy).trim() : undefined;
        if (createdBy !== undefined) {
            // Basic ObjectId format validation (24 hex characters)
            const objectIdRegex = /^[0-9a-fA-F]{24}$/;
            if (!objectIdRegex.test(createdBy)) {
                validationErrors.push('createdBy must be a valid ObjectId');
            }
        }

        // Return validation errors if any
        if (validationErrors.length > 0) {
            return next(errorHandler(400, validationErrors.join(', ')));
        }

        console.log('Manual validation successful!');
        console.log('Validated parameters:', {
            page, limit, search, category, inStock, minPrice, maxPrice, sortBy, sortOrder, createdBy
        });

        // Convert inStock string to boolean if needed
        let inStockBoolean = undefined;
        if (inStock === 'true') inStockBoolean = true;
        if (inStock === 'false') inStockBoolean = false;

        // Build filter object
        const filter = {};
        if (search) {
            filter.$or = [
                { productName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (category) filter.category = category;
        if (inStockBoolean !== undefined) filter.inStock = inStockBoolean;
        if (createdBy) filter.createdBy = createdBy;
        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined) filter.price.$gte = minPrice;
            if (maxPrice !== undefined) filter.price.$lte = maxPrice;
        }

        // Sort and pagination
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        const skip = (page - 1) * limit;

        // Execute query
        const [products, totalCount] = await Promise.all([
            Product.find(filter)
                .populate('createdBy', 'username email')
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(filter)
        ]);

        // Calculate pagination
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            success: true,
            data: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.log('=== ERROR CAUGHT ===');
        console.log('Error:', error.message);

        next(errorHandler(500, error.message || 'Failed to fetch products'));
    }
};

export const getSingleProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(errorHandler(400, "Invalid product ID format"));
        }

        const product = await Product.findById(id).populate("createdBy", "name email username");

        if (!product) {
            return next(errorHandler(404, "Product not found"));
        }

        res.status(200).json({ product });
    } catch (err) {
        next(errorHandler(500, err.message || "Server error"));
    }
};


export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(errorHandler(400, "Invalid product ID"));
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id, createdBy: req.user.id }, // ownership check here
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return next(errorHandler(403, "Not authorized or product not found"));
        }

        res.status(200).json({ message: "Product updated Successfully", updatedProduct });
    } catch (err) {
        next(errorHandler(500, err.message || "Server error"));
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(errorHandler(400, "Invalid product ID"));
        }

        const deletedProduct = await Product.findOneAndDelete({
            _id: id,
            createdBy: req.user.id
        });

        if (!deletedProduct) {
            return next(errorHandler(403, "Not authorized or product not found"));
        }

        res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct
        });
    } catch (err) {
        next(errorHandler(500, err.message || "Server error"));
    }
};

export const generateProduct = async (req, res, next) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY environment variable is not set');
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Add randomness to ensure unique products
        const categories = ['Electronics', 'Clothing', 'Food'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomSeed = Math.floor(Math.random() * 10000);
        const timestamp = Date.now();

        const prompt = `
Generate a unique and realistic product as a JSON object **only** with these fields. 
Make it creative and different from typical products.

Category focus: ${randomCategory}
Random seed: ${randomSeed}
Timestamp: ${timestamp}

Create a product that is unique and creative. Avoid generic names like "Wireless Headphones", "Smart Watch", etc.

{
  "productName": "string (make this unique and creative)",
  "category": "Electronics|Clothing|Food",
  "inStock": true|false,
  "price": number (between 10 and 500),
  "quantity": number (between 1 and 100),
  "description": "string (detailed and unique description)"
}

Do not include any extra text, explanation, or comments. Output must be valid JSON.
Make the product name completely unique and creative.
`;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.9, // High creativity
                topP: 0.8,
                topK: 40
            }
        });

        const result = await model.generateContent(prompt);

        const generatedText = result?.response?.text();

        if (!generatedText) {
            return next(errorHandler(500, "No product generated from Gemini."));
        }

        // Clean the response (remove potential markdown formatting)
        const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();

        let productData;
        try {
            productData = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Generated text:', generatedText);
            return next(errorHandler(500, "Generated content is not valid JSON."));
        }

        // Just return the generated product data without saving to database
        res.status(200).json({
            success: true,
            generatedProduct: productData,
            message: "Product generated successfully"
        });

    } catch (err) {
        console.error('Gemini API Error:', err);
        return next(errorHandler(500, err.message || "Server error"));
    }
};