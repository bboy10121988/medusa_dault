import { createClient } from '@sanity/client'

const isServer = typeof window === 'undefined'
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-08-01',
  useCdn: !isServer, // server 端不使用 CDN 以取得最新 draft
  token: isServer ? process.env.SANITY_API_READ_TOKEN : undefined,
  perspective: isServer && process.env.SANITY_API_READ_TOKEN ? 'previewDrafts' : 'published',
})

export async function fetchProductCopy(productId: string) {
  const query = `*[_type == "productCopy" && productId == $productId][0]{tagline,longDescription}`
  return sanityClient.fetch(query, { productId })
}
