import z from "zod";

export const createTourZodValidation = z.object({
  slug: z.string(),
  title: z.string(),

  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  location: z.string().optional(),
  costFrom: z.number().optional(),

  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),

  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),

  maxPeople: z.number(),
  minAge: z.number().optional(),

  division: z.string(),
  tourDuration: z.string(),
});
