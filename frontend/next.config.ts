import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://www.instagram.com`,
  "style-src 'self' 'unsafe-inline' https://www.instagram.com",
  "img-src 'self' data: blob: https://sitio.cms.iesnuevohorizonte.com https://*.cdninstagram.com https://*.fbcdn.net",
  "font-src 'self' data:",
  "connect-src 'self' https://www.instagram.com https://graph.instagram.com",
  "frame-src 'self' https://www.instagram.com https://www.google.com https://www.youtube.com https://player.vimeo.com",
  "media-src 'self' blob: https://*.cdninstagram.com https://*.fbcdn.net",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  ...(
    isDevelopment
      ? []
      : [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
  ),
];

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "sitio.cms.iesnuevohorizonte.com",
    pathname: "/storage/**",
  },
];

if (isDevelopment) {
  remotePatterns.push(
    {
      protocol: "http",
      hostname: "127.0.0.1",
      port: "8000",
      pathname: "/storage/**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      port: "8000",
      pathname: "/storage/**",
    },
  );
}

for (const configuredUrl of [process.env.NEXT_PUBLIC_API_URL, process.env.BACKEND_URL]) {
  if (!configuredUrl) continue;

  try {
    const url = new URL(configuredUrl);
    const protocol = url.protocol === "https:" ? "https" : "http";
    const isLocalHost = url.hostname === "127.0.0.1" || url.hostname === "localhost";

    if (!isDevelopment && isLocalHost) continue;

    if (!remotePatterns.some((pattern) => pattern.hostname === url.hostname && pattern.port === url.port)) {
      remotePatterns.push({ protocol, hostname: url.hostname, port: url.port, pathname: "/storage/**" });
    }
  } catch {
    // Next validará las variables públicas durante el consumo de la API.
  }
}

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/campus',
        destination: 'https://sga.iesnuevohorizonte.com',
        permanent: true,
      },
      {
        source: '/campus/:path*',
        destination: 'https://sga.iesnuevohorizonte.com',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns,
    dangerouslyAllowLocalIP: isDevelopment,
    maximumRedirects: 0,
    maximumResponseBody: 10_000_000,
  },
};

export default nextConfig;
