export const toUniqueArray = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};
