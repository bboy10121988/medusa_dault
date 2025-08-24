"use client"

import { useState, useRef, useEffect } from "react"
import LocalizedClientLink from "../../common/components/localized-client-link/index"

type MobileMenuProps = {
  regions?: any[]
  navigation?: Array<{name: string; href: string}>
  categories?: Array<{id: string; handle: string; name: string}>
  headerData?: any
}

export default function MobileMenu({ regions, navigation, categories, headerData }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [menuTopOffset, setMenuTopOffset] = useState(0)
  const searchRef = useRef<HTMLInputElement>(null)

  // 動態計算選單頂部偏移 - 確保選單緊貼導覽列底部
  useEffect(() => {
    const calculateMenuTopOffset = () => {
      // 直接使用 sticky 導覽列的位置計算
      const stickyNav = document.querySelector('.sticky.top-0')
      
      if (stickyNav) {
        const stickyNavRect = stickyNav.getBoundingClientRect()
        // 選單頂部位置 = sticky 導覽列頂部 + sticky 導覽列高度
        const totalOffset = stickyNavRect.top + stickyNavRect.height
        
        setMenuTopOffset(totalOffset)
        console.log(`📱 選單位置計算: sticky導覽頂部=${stickyNavRect.top}px, 高度=${stickyNavRect.height}px, 選單位置=${totalOffset}px`)
      }
    }

    // 初始計算
    calculateMenuTopOffset()

    // 監聽視窗大小變化
    window.addEventListener('resize', calculateMenuTopOffset)
    
    // 使用 MutationObserver 監聽 DOM 變化
    const observer = new MutationObserver(() => {
      // 延遲一點計算，確保 DOM 更新完成
      setTimeout(calculateMenuTopOffset, 100)
    })
    const targetNode = document.body
    observer.observe(targetNode, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    })

    return () => {
      window.removeEventListener('resize', calculateMenuTopOffset)
      observer.disconnect()
    }
  }, [isOpen]) // 當選單開啟時重新計算

  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus()
    }
  }, [showSearch])

  return (
    <div className="block lg:hidden">
      <button
        onClick={() => {
          setIsOpen(true)
          // 立即重新計算選單位置
          setTimeout(() => {
            const stickyNav = document.querySelector('.sticky.top-0')
            if (stickyNav) {
              const stickyNavRect = stickyNav.getBoundingClientRect()
              const totalOffset = stickyNavRect.top + stickyNavRect.height
              setMenuTopOffset(totalOffset)
              console.log(`📱 開啟選單時位置: ${totalOffset}px`)
            }
          }, 10)
        }}
        className="flex items-center justify-center w-8 h-8"
        aria-label="開啟選單"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="fixed inset-x-0 bottom-0 z-[110] bg-white shadow-lg border-t border-gray-200"
          style={{
            top: `${menuTopOffset}px`
          }}
        >
          {/* 選單內容 */}
          <div className="max-h-screen overflow-y-auto">
            {/* 選單標頭 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <span className="font-medium text-lg">選單</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="關閉選單"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 搜尋欄 */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="搜尋商品..."
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 導航項目 */}
            <div className="p-4 space-y-2">
              {navigation?.map((item, index) => {
                const isExternal = /^(http|https|www)/.test(item.href)
                const processedHref = isExternal 
                  ? item.href 
                  : item.href.startsWith('/') 
                    ? item.href 
                    : `/${item.href}`

                return isExternal ? (
                  <a
                    key={index}
                    href={processedHref}
                    className="block py-3 px-4 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <LocalizedClientLink
                    key={index}
                    href={processedHref}
                    className="block py-3 px-4 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </LocalizedClientLink>
                )
              })}

              {/* 商品分類 */}
              {categories && categories.length > 0 && (
                <>
                  <div className="pt-4 pb-2 border-t border-gray-200 mt-4">
                    <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      商品分類
                    </h3>
                  </div>
                  {categories.map((category) => (
                    <LocalizedClientLink
                      key={category.id}
                      href={`/categories/${category.handle}`}
                      className="block py-3 px-4 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      {category.name}
                    </LocalizedClientLink>
                  ))}
                </>
              )}
            </div>

            {/* 底部功能 */}
            <div className="border-t border-gray-200 p-4 space-y-3">
              {/* 國家選擇 */}
              {regions && (
                <div>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>選擇地區</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* 帳戶和購物車連結 */}
              <div className="flex justify-between">
                <LocalizedClientLink
                  href="/account"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>我的帳戶</span>
                </LocalizedClientLink>
                
                <LocalizedClientLink
                  href="/cart"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 5H3m4 8v6a1 1 0 001 1h8a1 1 0 001-1v-6M9 17h6" />
                  </svg>
                  <span>購物車</span>
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 背景遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[105]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
