// import "bootstrap/dist/css/bootstrap.min.css";

import type { FC, ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps, NextWebVitalsMetric } from "next/app";

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

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

import "../styles/globals.scss";
import "../styles/bootstrap-theme/theme-dark.scss";
import { adventPro, robotoFlex } from "src/fonts/font";

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
    <main
    // className={`${robotoFlex.className} ${robotoFlex.variable} ${adventPro.className}`}
    >
      <style jsx global>
        {`
          :root {
            --font-body: ${robotoFlex.style.fontFamily};
            // ${robotoFlex.variable}: ${robotoFlex.style.fontFamily};
            --font-title: ${adventPro.style.fontFamily};
            // ${robotoFlex.variable}: ${adventPro.style.fontFamily};
          }
        `}
      </style>
      <StargazeProvider client={stargazeClient}>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <GoogleAnalytics trackPageViews />
            <ToastContainer />
            {getLayout(<Component {...pageProps} />)}
            <Analytics />;
          </UserProvider>
        </QueryClientProvider>
      </StargazeProvider>{" "}
    </main>
  ) as ReactElement;
};

export default trpcNextPW.withTRPC(MyApp);
