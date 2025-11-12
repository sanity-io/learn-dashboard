import { createClient } from '@sanity/client'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import imageUrlBuilder from '@sanity/image-url'

const client = createClient({
  projectId: import.meta.env.SANITY_APP_PROJECT_ID || '',
  dataset: import.meta.env.SANITY_APP_DATASET || '',
  useCdn: true,
  apiVersion: '2025-09-15',
})
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
