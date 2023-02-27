
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
  transpilePackages: ["@publicworks.art/db-typeorm"],
};

module.exports = nextConfig;
