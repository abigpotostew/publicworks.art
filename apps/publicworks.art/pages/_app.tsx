import "../styles/globals.scss";

import type { FC, ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps, NextWebVitalsMetric } from "next/app";

import { SSRProvider } from "react-bootstrap";
import { event, GoogleAnalytics } from "nextjs-google-analytics";
import { queryClient, trpcNextPW } from "../src/server/utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../src/icon/icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StargazeProvider } from "@stargazezone/client";
import stargazeClient from "src/stargaze/stargaze";
import { UserProvider } from "src/context/user/UserProvider";
import { Analytics } from "@vercel/analytics/react";
import { Advent_Pro, Roboto_Flex } from "next/font/google";

const adventPro = Advent_Pro({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-advent-pro",
});

const robotoFlex = Roboto_Flex({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-roboto-flex",
});
export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export function reportWebVitals(metric: NextWebVitalsMetric) {
  const { id, name, label, value } = metric;
  event(name, {
    category: label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
    value: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
    label: id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate.
  });
}

const MyApp: FC<AppPropsWithLayout> = ({
  Component,
  pageProps,
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <SSRProvider>
      <StargazeProvider client={stargazeClient}>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <GoogleAnalytics trackPageViews />
            <ToastContainer />
            <div
              className={`${robotoFlex.variable} ${adventPro.variable} font-body`}
            >
              {getLayout(<Component {...pageProps} />)}
            </div>
            <Analytics />
          </UserProvider>
        </QueryClientProvider>
      </StargazeProvider>
    </SSRProvider>
  ) as ReactElement;
};

export default trpcNextPW.withTRPC(MyApp);
