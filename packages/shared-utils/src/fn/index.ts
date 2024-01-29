export const toUniqueArray = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr).values());
};
