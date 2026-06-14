const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/login',
        disallow: '/',
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
