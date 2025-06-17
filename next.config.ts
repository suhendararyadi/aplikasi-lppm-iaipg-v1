import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Opsi untuk TypeScript
  typescript: {
    // !! PENTING !!
    // Opsi ini akan menginstruksikan Next.js untuk tetap membuat build produksi
    // meskipun aplikasi Anda memiliki error TypeScript.
    // Sebaiknya ini hanya digunakan sebagai solusi sementara.
    ignoreBuildErrors: true,
  },
  /* config options here */
};

export default nextConfig;
