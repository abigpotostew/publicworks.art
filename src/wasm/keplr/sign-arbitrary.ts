export const buildMessage = (otp: string) => {
  return {
    title: "Public Works Login",
    description:
      "This is a transaction that allows PublicWorks.art to authenticate you with our application.",
    nonce: otp,
  };
};
