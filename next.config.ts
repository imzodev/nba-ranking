import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'upload.wikimedia.org',  // Allow images from Wikimedia
      'commons.wikimedia.org', // Also allow from commons.wikimedia.org
      'en.wikipedia.org'       // Also allow from en.wikipedia.org
    ],
  },
};

export default nextConfig;
