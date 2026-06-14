export default function manifest() {
  return {
    name: 'Calendar Reflect',
    short_name: 'CalReflect',
    description: 'Understand your time. Weekly and monthly reflections from your calendar.',
    start_url: '/login',
    display: 'standalone',
    background_color: '#06091A',
    theme_color: '#6366F1',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
  }
}
