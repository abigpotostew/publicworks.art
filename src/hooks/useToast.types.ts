export interface UseToastTypes {
  success: (msg: string) => void;
  error: (msg: string) => void;
  errorRedirect: (msg: string, redirect: string) => void;
}
