import { z } from 'zod';
import mongoose from 'mongoose';

/// Product validation schema for CREATE operations (without createdBy)
export const productSchema = z.object({
    productName: z.string()
        .min(3, "Product name must be at least 3 characters")
        .max(100, "Product name cannot exceed 100 characters")
        .trim(),

    category: z.enum(["Electronics", "Clothing", "Food"], {
        errorMap: () => ({ message: "Category must be Electronics, Clothing, or Food" }),
    }),

    price: z.number()
        .min(0, "Price cannot be negative")
        .max(100000, "Price cannot exceed 100,000"),

    quantity: z.number()
        .int("Quantity must be an integer")
        .min(1, "Quantity must be at least 1"),

    // Optional fields (not required in Mongoose)
    inStock: z.boolean().default(true).optional(),

    description: z.string()
        .max(1000, "Description cannot exceed 1000 characters")
        .trim()
        .optional(),

    // Note: createdBy will be added automatically from req.user.id
    // Note: totalValue is auto-calculated by Mongoose pre-save hook
    // Note: timestamps are handled by Mongoose automatically
});

// Product validation schema for UPDATE operations
export const productUpdateSchema = productSchema.partial();
