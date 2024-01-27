import { z } from "zod";
import { isISODate } from "@publicworks/publicworks.art/src/util/isISODate";
import { Column } from "typeorm";
import { normalizeMetadataUri } from "@publicworks/publicworks.art/src/wasm/metadata";

export const workZod = z.object({
  id: z.number(),
  codeCid: z.string(),
  name: z.string(),
  creator: z.string(),
  slug: z.string(),
  sg721: z.string().nullable(),
  minter: z.string().nullable(),
  sg721CodeId: z.number().nullable(),
  minterCodeId: z.number().nullable(),

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
  ownerAddress: z.string().optional(),

  isDutchAuction: z.boolean().default(false),
  dutchAuctionEndPrice: z.number().min(50).nullish(),
  dutchAuctionEndDate: z
    .date()
    .transform((d) => d?.toISOString() || null)
    .nullish(),
  dutchAuctionDeclinePeriodSeconds: z
    .number()
    .min(1)
    .max(86400)
    .default(300)
    .nullish(),
  dutchAuctionDecayRate: z.number().min(0).max(1).default(0.85).nullish(),
});

export type WorkSerializable = z.infer<typeof workZod>;

export const tokenZod = z.object({
  id: z.string(),
  hash: z.string(),
  token_id: z.string(),
  status: z.number(),
  imageUrl: z.string(),
  metadataUri: z.string(),
  createdDate: z.date().transform((d) => d.toISOString()),
  updatedDate: z.date().transform((d) => d.toISOString()),
});

export type TokenSerializable = z.infer<typeof tokenZod>;

export type TokenSerializableWithMetadata = TokenSerializable & {
  imageUrl: string | null;
  metadataUri: string | null;
};
