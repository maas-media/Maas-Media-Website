import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: 'lypfvde0',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Fetch site settings (headshot, bio, social links etc.)
export async function getSiteSettings() {
  return client.fetch(`
    *[_type == "siteSettings"][0] {
      "headshot": headshot.asset->url,
      tagline,
      bio,
      location,
      experience,
      instagramUrl,
      youtubeUrl,
      linkedinUrl,
      "heroImages": heroImages[].asset->url
    }
  `)
}

// Fetch all projects
export async function getProjects() {
  return client.fetch(`
    *[_type == "project"] | order(order asc) {
      "id": _id,
      title,
      categories,
      orientation,
      vimeoUrl,
      "thumbnail": thumbnail.asset->url,
      description,
      featured
    }
  `)
}

// Fetch all blog posts
export async function getPosts() {
  return client.fetch(`
    *[_type == "post"] | order(date desc) {
      "id": _id,
      title,
      "slug": slug.current,
      category,
      "date": date,
      excerpt,
      "thumbnail": thumbnail.asset->url,
      featured,
      youtubeUrl,
      content
    }
  `)
}

// Fetch all testimonials
export async function getTestimonials() {
  return client.fetch(`
    *[_type == "testimonial"] | order(order asc) {
      "id": _id,
      name,
      role,
      text
    }
  `)
}
