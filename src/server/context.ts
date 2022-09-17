// The app's context - is generated for each incoming request
import * as trpcNext from "@trpc/server/adapters/next";
import { verifyCookie } from "../auth/jwt";
import * as trpc from "@trpc/server";
import { UserRepo } from "../store/user";
import { firestore, User } from "../store";
import { stores } from "../store/stores";

export async function createContext(
  opts?: trpcNext.CreateNextContextOptions
): Promise<Context> {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers
  // This is just an example of something you'd might want to do in your ctx fn
  async function getUser() {
    if (opts?.req?.cookies && opts.req.cookies["PWToken"]) {
      // const user = await decodeJwtToken(req.headers.authorization.split(' ')[1])
      // return user;

      const payload = verifyCookie(opts.req);
      if (payload) {
        return stores().user.getUser(payload.account);
      }
    }
    return null;
  }
  const maybeUser = await getUser();
  const user = maybeUser && maybeUser.ok && maybeUser.value;
  if (!user) {
    return {
      authorized: false,
      user: null,
    };
  } else {
    return {
      authorized: true,
      user: user,
    };
  }
}

export type Context =
  | { authorized: false | null | undefined | "" | 0; user: null }
  | { authorized: true; user: User };

export const createRouter = () => {
  return trpc.router<Context>();
};
