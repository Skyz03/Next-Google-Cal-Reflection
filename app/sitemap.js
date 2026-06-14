const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export default function sitemap() {
  return [
    {
      url: `${base}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
