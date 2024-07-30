import { z } from "zod";

const loginSchema = z.object({
    username: z
    .string({ required_error: "Username is required" })
    .trim(),

    password: z
    .string({ required_error: "Password is required" })
    .trim()
});

export default loginSchema;