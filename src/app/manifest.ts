import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LINK'D UP",
    short_name: "LINK'D UP",
    description:
      "Your Link'd Up membership app — the Growth Circle, AI & business updates, and everything happening in the community.",
    start_url: '/home',
    id: '/home',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#000000',
    theme_color: '#000000',
    categories: ['business', 'social', 'productivity'],
    icons: [
      { src: '/api/icon?size=192', sizes: '192x192', type: 'image/png' },
      { src: '/api/icon?size=512', sizes: '512x512', type: 'image/png' },
      { src: '/api/icon?size=192&maskable=1', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/api/icon?size=512&maskable=1', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
