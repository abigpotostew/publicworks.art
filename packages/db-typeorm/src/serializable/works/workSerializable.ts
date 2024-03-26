import { z } from "zod";

export const workZod = z.object({
  id: z.number(),
  codeCid: z.string().nullish(),
  name: z.string(),
  creator: z.string(),
  slug: z.string(),
  sg721: z.string().nullish(),
  minter: z.string().nullish(),
  sg721CodeId: z.number().nullish(),
  minterCodeId: z.number().nullish(),

  description: z.string(),
  additionalDescription: z.string().optional().nullish(),
  blurb: z.string(),
  startDate: z
    .date()
    .nullish()
    .optional()
    .transform((d) => d?.toISOString() || null),

  resolution: z
    .string()
    .regex(/^\d+:\d+$/)
    .nullish(),

  selector: z.string().nullish(),
  license: z.string().max(1000).nullish(),

  pixelRatio: z.number().nullish(),
  maxTokens: z.number().nullish(),
  priceStars: z.number().nullish(),
  royaltyPercent: z.number().nullish().optional(),
  royaltyAddress: z.string().nullish().optional(),
  coverImageCid: z.string().nullish().optional(),
  externalLink: z.string().nullish().optional(),

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
  imageUrl: z.string().nullish(),
  metadataUri: z.string().nullish(),
  createdDate: z.date().transform((d) => d.toISOString()),
  updatedDate: z.date().transform((d) => d.toISOString()),
});

export const tokenFullZod = tokenZod.merge(
  z.object({
    blockheight: z.string(),
    tx_hash: z.string(),
    tx_memo: z.string(),
  })
);

export type TokenSerializable = z.infer<typeof tokenZod>;
export type TokenFullSerializable = z.infer<typeof tokenFullZod>;

export type TokenSerializableWithMetadata = TokenSerializable;
