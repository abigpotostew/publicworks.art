export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const Ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const Err = <T, E = Error>(error: E): Result<T, E> => ({
  ok: false,
  error,
});
