/**
 * Webhook 配置
 * 
 * WEBHOOK_URL: Frontend API endpoint 的位置
 * WEBHOOK_SECRET: 用於驗證 webhook 請求的密鑰
 */

export const WEBHOOK_URL = process.env.NEXT_PUBLIC_BASE_URL + '/api/generate-page'
export const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET || 'medusa-sanity-webhook-secret'
