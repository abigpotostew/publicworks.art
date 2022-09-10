import '../styles/globals.css'

import type { FC, ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css';
import { SSRProvider } from 'react-bootstrap';
import { SWRConfig } from 'swr';
import { useEffect } from "react";
import { useRouter } from "next/router";
import * as ga from '../src/lib/ga'
import { GoogleAnalytics, event } from "nextjs-google-analytics";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "./api/trpc/[trpc]";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

interface SwrError extends Error {
  info?: any;
  status?: number | string;
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  const { id, name, label, value } = metric;
  event(name, {
    category: label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
    value: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
    label: id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate.
  });
}

const fetcher = async (url:string) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error: SwrError = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

const MyApp:FC<AppPropsWithLayout>=({ Component, pageProps }: AppPropsWithLayout) =>{
  const getLayout = Component.getLayout || ((page) => page)
  
  
  
  return getLayout(<SSRProvider>
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      <GoogleAnalytics trackPageViews />

      <Component {...pageProps} />
    </SWRConfig>
    </SSRProvider>
    
  ) as ReactElement<any, any>
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc';
    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);

