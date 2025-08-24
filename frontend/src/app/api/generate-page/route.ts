import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const webhookSecret = request.headers.get('x-webhook-secret')
    
    // 驗證 webhook secret
    if (webhookSecret !== process.env.SANITY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Invalid webhook secret' }, { status: 401 })
    }

    const { event, documentId } = body

    if (event === 'page.publish' && documentId) {
      // 重新驗證相關頁面
      revalidatePath('/')
      revalidatePath('/[countryCode]', 'page')
      
      console.log(`Revalidated pages for document: ${documentId}`)
      
      return NextResponse.json({ 
        message: 'Pages regenerated successfully',
        documentId,
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({ message: 'No action taken' })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
