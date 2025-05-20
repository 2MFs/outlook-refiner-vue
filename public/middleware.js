// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  const response = NextResponse.next()

  // 加入 Outlook 所需的 CSP 設定
  response.headers.set(
    'Content-Security-Policy',
    'frame-ancestors https://outlook.office.com https://outlook.office365.com https://*.officeapps.live.com;'
  )

  // 明確允許 iframe 嵌入
  response.headers.set('X-Frame-Options', 'ALLOWALL')

  return response
}
