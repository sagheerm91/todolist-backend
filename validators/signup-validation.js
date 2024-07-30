import { z } from "zod";

const signupSchema = z.object({
    name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(255, { message: "Name must be less than 255 characters" }),

  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(255, { message: "Username must be less than 255 characters" }),

    email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({message:"Invalid email address"})
    .min(3, { message: "Email must be at least 3 characters long" })
    .max(255, { message: "Email must be less than 255 characters" }),

    phone: z
    .string({ required_error: "Phone is required" })
    .trim()
    .min(10, { message: "Phone must be at least 10 characters long" })
    .max(20, { message: "Phone must be less than 20 characters" }),
    
    password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password must be less than 20 characters" }),
});

export default signupSchema;

