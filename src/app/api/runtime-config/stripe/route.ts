import {
  isStripePublishableKey,
  STRIPE_PUBLIC_KEY_ENV
} from '@/components/payment/stripe_config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  // Acesso dinâmico intencional: mantém a leitura no runtime do servidor.
  // Assim, o App Setting do Azure funciona mesmo quando a imagem foi
  // construída sem uma variável NEXT_PUBLIC_* incorporada ao bundle.
  const publicKey = process.env[STRIPE_PUBLIC_KEY_ENV]

  if (!isStripePublishableKey(publicKey)) {
    return NextResponse.json(
      { publicKey: null },
      {
        status: 503,
        headers: { 'Cache-Control': 'no-store' }
      }
    )
  }

  return NextResponse.json(
    { publicKey },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
