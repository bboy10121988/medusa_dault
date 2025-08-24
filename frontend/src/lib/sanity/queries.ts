import { sanityClient } from './client'
import { SanityHeader, SanityFooter } from '../../types/global'

// 快取機制
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5分鐘

function withCache<T>(key: string, fn: () => Promise<T>, ttl: number = CACHE_TTL): Promise<T> {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < ttl) {
    return Promise.resolve(cached.data)
  }

  return fn().then(data => {
    cache.set(key, { data, timestamp: Date.now() })
    return data
  }).catch(error => {
    // 如果有快取資料但已過期，在錯誤時仍返回舊資料
    if (cached) {
      console.warn(`API 調用失敗，使用快取資料: ${key}`, error)
      return cached.data
    }
    throw error
  })
}

export async function getHeader(): Promise<SanityHeader | null> {
  return withCache('header', async () => {
    try {
      const query = `*[_type == "header"][0] {
        storeName,
        logo {
          asset->{
            url
          },
          alt
        },
        logoHeight,
        navigation[] {
          name,
          href
        },
        marquee {
          enabled,
          text1 {
            enabled,
            content
          },
          text2 {
            enabled,
            content
          },
          text3 {
            enabled,
            content
          },
          linkUrl,
          pauseOnHover
        }
      }`

      const result = await sanityClient.fetch(query)
      
      if (result?.logo?.asset) {
        result.logo = {
          url: result.logo.asset.url,
          alt: result.logo.alt || 'Store logo'
        }
      }

      return result as SanityHeader
    } catch (error) {
      console.warn('無法從 Sanity 獲取 header 資料，使用預設值', error)
      return {
        storeName: 'Medusa Store',
        navigation: [
          { name: '首頁', href: '/' },
          { name: '商品', href: '/store' },
          { name: '關於我們', href: '/about' },
          { name: '聯絡我們', href: '/contact' }
        ]
      }
    }
  })
}

export async function getFooter(): Promise<SanityFooter | null> {
  return withCache('footer', async () => {
    try {
      const query = `*[_type == "footer"][0] {
        title,
        logo {
          asset->{
            url
          },
          alt
        },
        logoWidth,
        sections[] {
          title,
          links[] {
            text,
            url
          }
        },
        contactInfo {
          phone,
          email
        },
        socialMedia {
          facebook {
            enabled,
            url
          },
          instagram {
            enabled,
            url
          },
          line {
            enabled,
            url
          },
          youtube {
            enabled,
            url
          },
          twitter {
            enabled,
            url
          }
        },
        copyright
      }`

      const result = await sanityClient.fetch(query)
      
      if (result?.logo?.asset) {
        result.logo = {
          url: result.logo.asset.url,
          alt: result.logo.alt || 'Store logo'
        }
      }

      return result as SanityFooter
    } catch (error) {
      console.warn('無法從 Sanity 獲取 footer 資料，使用預設值', error)
      return {
        sections: [
          {
            title: '商品',
            links: [
              { text: '所有商品', url: '/store' },
              { text: '新品上市', url: '/collections/new' },
              { text: '特價商品', url: '/collections/sale' }
            ]
          },
          {
            title: '服務',
            links: [
              { text: '配送資訊', url: '/shipping' },
              { text: '退換貨', url: '/returns' },
              { text: '客戶服務', url: '/support' }
            ]
          }
        ],
        copyright: `© ${new Date().getFullYear()} Medusa Store. All rights reserved.`
      }
    }
  })
}
