import { httpLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { NextPageContext } from "next";
import superjson from "superjson";
import { AppRouter } from "../routes/_app";
import { QueryCache, QueryClient } from "@tanstack/react-query";
// ℹ️ Type-only import:
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * Extend `NextPageContext` with meta data that can be picked up by `responseMeta()` when server-side rendering
 */
export interface SSRContext extends NextPageContext {
  /**
   * Set HTTP Status code
   * @example
   * const utils = trpc.useContext();
   * if (utils.ssrContext) {
   *   utils.ssrContext.status = 404;
   * }
   */
  status?: number;
}

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createReactQueryHooks`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */
// export const trpcNextPW = createTRPCNext<AppRouter, SSRContext>({
//   config({ ctx }) {
//     /**
//      * If you want to use SSR, you need to use the server's full URL
//      * @link https://trpc.io/docs/ssr
//      */
//     return {
//       /**
//        * @link https://trpc.io/docs/data-transformers
//        */
//       transformer: superjson,
//       /**
//        * @link https://trpc.io/docs/links
//        */
//       links: [
//         // adds pretty logs to your console in development and logs errors in production
//         loggerLink({
//           enabled: (opts) =>
//             process.env.NODE_ENV === "development" ||
//             (opts.direction === "down" && opts.result instanceof Error),
//         }),
//         httpBatchLink({
//           url: `${getBaseUrl()}/api/trpc`,
//           /**
//            * Set custom request headers on every request from tRPC
//            * @link http://localhost:3000/docs/v10/header
//            * @link http://localhost:3000/docs/v10/ssr
//            */
//           headers() {
//             return {};
//           },
//         }),
//       ],
//       /**
//        * @link https://react-query.tanstack.com/reference/QueryClient
//        */
//       // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
//     };
//   },
//   /**
//    * @link https://trpc.io/docs/ssr
//    */
//   ssr: false,
// });
export const queryCache = new QueryCache();
export const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    mutations: {
      onMutate: async (vars) => {
        // do login here if needed
        // const token = getToken();
      },
    },
  },
});
// queryCache.subscribe((event) => {
//   if (event.query.queryHash.includes("getUser"))
//     console.log("cache", event.type, event.query);
// });
export const trpcNextPW = createTRPCNext<AppRouter, SSRContext>({
  transformer: superjson, // <-- add this
  config({ ctx }) {
    return {
      links: [
        // httpBatchLink({
        //   /**
        //    * If you want to use SSR, you need to use the server's full URL
        //    * @link https://trpc.io/docs/ssr
        //    **/
        //   url: `${getBaseUrl()}/api/trpc`,
        // }),
        httpLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
        }),
      ],
      /**
       * @link https://tanstack.com/query/v4/docs/reference/QueryClient
       **/
      queryClient,
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
});

export type AppRouterUtilContext = ReturnType<typeof trpcNextPW.useContext>;
