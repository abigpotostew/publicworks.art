
// The app's context - is generated for each incoming request
import * as trpcNext from "@trpc/server/adapters/next";
import { verifyCookie } from "../auth/jwt";
import * as trpc from "@trpc/server";

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers
  // This is just an example of something you'd might want to do in your ctx fn
  async function getToken() {
    if (opts?.req?.cookies && opts.req.cookies['PWToken']) {
      // const user = await decodeJwtToken(req.headers.authorization.split(' ')[1])
      // return user;

      return verifyCookie(opts.req)
    }
    return false;
  }
  const ok = await getToken();
  return {
    authorized:ok,
  };
}
export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => {
  return trpc.router<Context>();
}