import { z } from "zod";

const courseSchema = z.object({
    title: z
    .string()
    .trim()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(255, { message: "Title must be less than 255 characters" }),

    originalPrice: z
    .number({required_error: "Price is required"}),

    discountedPrice: z
    .number({required_error: "Disctounted Price is required"}),

    description: z
    .string({ required_error: "Description is required" })
    .trim()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(2000, { message: "Description must be less than 2000 characters" })


});

export default courseSchema;