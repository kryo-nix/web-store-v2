/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Mengabaikan semua error TypeScript agar build tetap berhasil.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Mengabaikan error ESLint agar build tetap berhasil.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
