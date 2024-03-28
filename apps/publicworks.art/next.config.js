// the main common security headers
const baseSecurityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // Isolates the browsing context exclusively to same-origin documents.
  // Cross-origin documents are not loaded in the same browsing context.
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
];
const articlesAllowedDomains =
  "https://*.spotify.com/ https://spotify.com https://*.youtube.com/ https://youtube.com https://*.twitter.com/ https://twitter.com";
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {},
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.publicworks.art",
        port: "",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "testnetmetadata.publicworks.art",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "metadata.publicworks.art",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            //todo this mightbe the problem!
            value: `frame-ancestors 'self'; frame-src ${process.env.NEXT_PUBLIC_IPFS_GATEWAY_SAFE} ${articlesAllowedDomains} 'self';`,
          },
          ...baseSecurityHeaders,
        ],
      },
      {
        source: "/sandbox/worker.js",
        headers: [
          {
            key: "service-worker-allowed",
            value: "/",
          },
        ],
      },
      {
        source: "/sandbox/preview.html",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },
  transpilePackages: [
    "@publicworks.art/db-typeorm",
    "@publicworks.art/ui",
    "@publicworks.art/shared-utils",
  ],
  redirects() {
    return [
      process.env.MAINTENANCE_MODE === "1"
        ? {
            source: "/((?!maintenance).*)",
            destination: "/maintenance",
            permanent: false,
          }
        : null,
    ].filter(Boolean);
  },
};
const analyze = process.env.ANALYZE === "true";
let withBundleAnalyzer;
if (analyze) {
  withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true,
  });
} else {
  withBundleAnalyzer = (x) => x;
}

module.exports = withBundleAnalyzer(nextConfig);

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "public-works-n7",
    project: "publicworks",
    authToken: process.env.SENTRY_AUTH_TOKEN,
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers. (increases server load)
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
