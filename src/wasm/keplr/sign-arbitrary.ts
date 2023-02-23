export const buildMessage = (otp: string) => {
  return {
    title: "Public Works Login",
    description:
      "This is a signature that verifies ownership of your wallet with PublicWorks.art.",
    nonce: otp,
  };
};
