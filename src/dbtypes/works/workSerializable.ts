import { Column, PrimaryGeneratedColumn } from "typeorm";
import { z } from "zod";

export const workZod = z.object({
  id: z.string(),
  codeCid: z.string(),
  name: z.string(),
  creator: z.string(),
  slug: z.string(),
  sg721: z.string().nullable(),
  minter: z.string().nullable(),

  description: z.string(),
  blurb: z.string(),
  startDate: z
    .date()
    .nullable()
    .optional()
    .transform((d) => d?.toISOString() || null),

  resolution: z
    .string()
    .regex(/^\d+:\d+$/)
    .nullable(),

  selector: z.string().nullable(),
  license: z.string().nullable(),

  pixelRatio: z.number().nullable(),
  maxTokens: z.number(),
  priceStars: z.number().nullable(),
  royaltyPercent: z.number().nullable().optional(),
  royaltyAddress: z.string().nullable().optional(),
  coverImageCid: z.string().nullable().optional(),
  externalLink: z.string().nullable().optional(),

  createdDate: z.date().transform((d) => d.toISOString()),
  updatedDate: z.date().transform((d) => d.toISOString()),
});

export type WorkSerializable = z.infer<typeof workZod>;
