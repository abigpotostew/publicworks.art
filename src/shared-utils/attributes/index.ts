import { z } from "zod";

type AttributeValue = string | number | boolean | null;
export class Attribute {
  trait_type: string;
  value: AttributeValue;
}

export const normalizeAttributes = (attributes: any): Attribute[] => {
  if (typeof attributes !== "object") {
    return [];
  }
  const normalized = Object.keys(attributes).map((k) => {
    if (typeof k !== "string") {
      return null;
    }
    const value = attributes[k];
    let valueOut: AttributeValue;
    if (typeof value === "number" || typeof value === "boolean") {
      valueOut = value;
    } else if (value === null || value === undefined) {
      valueOut = null;
    } else {
      valueOut = value.toString();
    }

    return { value: valueOut, trait_type: k };
  });
  return normalized.filter((n) => !!n) as Attribute[];
};

const zodAttribute = z.object({
  trait_type: z.string(),
  value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
});

const zodAttributes = z.array(zodAttribute);
type ValidityResponse =
  | {
      success: true;
    }
  | {
      success: false;
      errors: Record<string, string>;
    };
export const validAttributes = (attributes: any): ValidityResponse => {
  if (typeof attributes !== "object")
    return {
      success: false,
      errors: {
        attributes: "Attributes must be an object",
      },
    };
  const errors: Record<string, string> = {};
  Object.entries(attributes).forEach(([key, value]) => {
    const parsed = zodAttribute.safeParse({ trait_type: key, value });
    if (!parsed.success) errors[key] = parsed.error.message;
  });
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  } else {
    return {
      success: true,
    };
  }
};
