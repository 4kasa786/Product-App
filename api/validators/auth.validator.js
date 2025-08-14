import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.email({ message: "Invalid email format" }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    profilePicture: z.url().optional(),
});

export const loginSchema = z.object({
    email: z.email({ message: "Invalid email format" }),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
