export const cn = (...clnames: (string | undefined)[]): string => {
  return clnames.filter((c) => !!c).join(" ");
};
