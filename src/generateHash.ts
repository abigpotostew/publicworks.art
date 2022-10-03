export const generateTxHash = () => {
  const alphabet = "0123456789ABCDEF";
  return Array(64)
    .fill(0)
    .map((_) => alphabet[(Math.random() * alphabet.length) | 0])
    .join("");
};
