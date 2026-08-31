import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
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
];

for (const configuredUrl of [process.env.NEXT_PUBLIC_API_URL, process.env.BACKEND_URL]) {
  if (!configuredUrl) continue;

  try {
    const url = new URL(configuredUrl);
    const protocol = url.protocol === "https:" ? "https" : "http";
    if (!remotePatterns.some((pattern) => pattern.hostname === url.hostname && pattern.port === url.port)) {
      remotePatterns.push({ protocol, hostname: url.hostname, port: url.port, pathname: "/storage/**" });
    }
  } catch {
    // Next validará las variables públicas durante el consumo de la API.
  }
}

const nextConfig: NextConfig = {
  output: 'standalone',
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
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
