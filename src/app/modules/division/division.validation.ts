import z from "zod";

export const createDivisionSchemaZodValidation = z.object({
  name: z
    .string({ message: "Name must be a string" })
    .min(3, { message: "Name must be at least 3 characters" }),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});
