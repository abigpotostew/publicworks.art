// import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.scss";
import "../styles/bootstrap-theme/theme-dark.scss";

import type { FC, ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps, NextWebVitalsMetric } from "next/app";

import { SSRProvider } from "react-bootstrap";
import { SWRConfig } from "swr";
import { event, GoogleAnalytics } from "nextjs-google-analytics";
import { trpcNextPW } from "../src/server/utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../src/icon/icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StargazeProvider } from "@stargazezone/client";
import stargazeClient from "src/stargaze/stargaze";
import { UserProvider } from "src/context/user/UserProvider";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

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

const fetcher = async (url: string) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error: SwrError = new Error(
      "An error occurred while fetching the data."
    );
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

const queryClient = new QueryClient();

const MyApp: FC<AppPropsWithLayout> = ({
  Component,
  pageProps,
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <SSRProvider>
      <StargazeProvider client={stargazeClient}>
        <UserProvider>
          <SWRConfig
            value={{
              fetcher,
            }}
          >
            <GoogleAnalytics trackPageViews />
            <ToastContainer />
            {getLayout(<Component {...pageProps} />)}
          </SWRConfig>
        </UserProvider>
      </StargazeProvider>
    </SSRProvider>
  ) as ReactElement;
};

export default trpcNextPW.withTRPC(MyApp);
