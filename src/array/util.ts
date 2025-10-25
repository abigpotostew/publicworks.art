export const firstOrThrow = <T>(array: readonly T[] | null | undefined): T => {
  const el = first(array);
  if (!el) {
    throw new Error("np first element");
  }
  return el;
};
export const first = <T>(array: readonly T[] | null | undefined): T | null => {
  if (!array || !array.length) {
    return null;
  }
  return array[0];
};
