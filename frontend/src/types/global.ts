// import { StorePrice } from "@medusajs/types"

export type StorePrice = {
  amount: number
  currency_code: string
}

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type VariantPrice = {
  calculated_price_number: number
  calculated_price: string
  original_price_number: number
  original_price: string
  currency_code: string
  price_type: string
  percentage_diff: string
}

export type StoreFreeShippingPrice = StorePrice & {
  target_reached: boolean
  target_remaining: number
  remaining_percentage: number
}

// Sanity CMS 相關型別定義
export interface SanityHeader {
  storeName?: string
  logo?: {
    url: string
    alt?: string
  }
  logoHeight?: number
  navigation?: Array<{
    name: string
    href: string
  }>
  marquee?: {
    enabled: boolean
    text1?: {
      enabled: boolean
      content: string
    }
    text2?: {
      enabled: boolean
      content: string
    }
    text3?: {
      enabled: boolean
      content: string
    }
    linkUrl?: string
    pauseOnHover?: boolean
  }
}

export interface SanityFooter {
  title?: string
  logo?: {
    url: string
    alt?: string
  }
  logoWidth?: number
  sections?: FooterSection[]
  contactInfo?: {
    phone?: string
    email?: string
  }
  socialMedia?: {
    facebook?: SocialMediaItem
    instagram?: SocialMediaItem
    line?: SocialMediaItem
    youtube?: SocialMediaItem
    twitter?: SocialMediaItem
  }
  copyright?: string
}

export interface FooterSection {
  title: string
  links?: Array<{
    text: string
    url: string
  }>
}

export interface SocialMediaItem {
  enabled: boolean
  url?: string
}

export interface BlogPost {
  title: string
  slug: string
  mainImage?: {
    asset: {
      url: string
    }
  }
  publishedAt: string
  excerpt?: string
  categories?: Array<{
    _id: string
    title: string
  }>
  author?: {
    name: string
    image?: any
  }
  status: string
  _id: string
}
