import {z} from "zod";

const todoSchema = z.object({
    task: z.string({ required_error: "Task is required" })
    .trim()
    .min(3, { message: "Task must be at least 3 characters long" })
    .max(255, { message: "Task must be less than 255 characters" })
});

export default todoSchema;