import { z } from "zod";

export const userZod = z.object({
  id: z.string(),
  address: z.string(),
  name: z.string(),

  createdDate: z.date().transform((d) => d.toISOString()),
  updatedDate: z.date().transform((d) => d.toISOString()),
});

export type UserSerializable = z.infer<typeof userZod>;
