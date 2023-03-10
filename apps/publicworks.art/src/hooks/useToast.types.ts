export interface UseToastTypes {
  success: (msg: string) => void;
  txHash: (msg: string, txHash: string) => void;
  mint: (msg: string, slug: string, tokenId: string) => void;
  error: (msg: string) => void;
  errorRedirect: (msg: string, redirect: string) => void;
  errorLoginModal: () => void;
}
