import z from "zod";

export const createBookingZodValidation = z.object({
  tour: z.string(),
  peopleCount: z.number().int().positive(),
});
