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
      {
        source: '/relatorio/fazenda-amizade',
        destination: '/fazenda-amizade.html',
        permanent: false,
      },
      {
        source: '/relatorio/fazenda-villa-nova',
        destination: '/fazenda-villa-nova.html',
        permanent: false,
      },
      {
        source: '/anuncio/fazenda-paraibuna',
        destination: '/anuncio-fazenda-paraibuna.html',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig