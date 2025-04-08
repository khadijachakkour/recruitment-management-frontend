import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Le domaine autorisé
        pathname: '/**', // Autoriser toutes les images sous ce domaine
      },
    ],
  },
};

export default nextConfig;
