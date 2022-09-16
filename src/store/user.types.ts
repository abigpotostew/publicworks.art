import { z } from "zod";

export const UserFullZ = z.object({
  address: z.string(),
  name: z.string(),
});

export type User = z.infer<typeof UserFullZ>;