import { parseISO } from "date-fns";

export const isISODate = (str: string) => {
  const date = parseISO(str);
  return !!date;
};
