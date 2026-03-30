import z from "zod";
import { Role } from "./user.interface";

export const updateUserSchemaZodValidation = z.object({
  name: z
    .string({ message: "Name must be a string" })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(20, { message: "Name cannot exceed 20 characters" })
    .optional(),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(15, { message: "Password must be at most 15 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/,
      {
        message:
          "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@.#$!%*?&)",
      },
    )
    .optional(),

  role: z.enum(Object.values(Role)),

  phone: z.string().optional(),
  picture: z.string().optional(),
  address: z.string().optional(),

  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});
