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
  additionalDescription: z.string().optional().nullable(),
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
  license: z.string().max(1000).nullable(),

  pixelRatio: z.number().nullable(),
  maxTokens: z.number(),
  priceStars: z.number().nullable(),
  royaltyPercent: z.number().nullable().optional(),
  royaltyAddress: z.string().nullable().optional(),
  coverImageCid: z.string().nullable().optional(),
  externalLink: z.string().nullable().optional(),

  createdDate: z.date().transform((d) => d.toISOString()),
  updatedDate: z.date().transform((d) => d.toISOString()),

  hidden: z.boolean().optional(),
});

export type WorkSerializable = z.infer<typeof workZod>;

export const tokenZod = z.object({
  id: z.string(),
  hash: z.string(),
  token_id: z.string(),
  status: z.number(),
  imageUrl: z.string().nullable(),
  metadataUri: z.string().nullable(),
  createdDate: z.date().transform((d) => d.toISOString()),
  updatedDate: z.date().transform((d) => d.toISOString()),
});

export type TokenSerializable = z.infer<typeof tokenZod>;
