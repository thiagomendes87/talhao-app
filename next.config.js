/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/relatorio/fazenda-tres-barras',
        destination: '/fazenda-tres-barras.html',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig