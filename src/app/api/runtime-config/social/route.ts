import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  // Acesso dinâmico intencional: mantém a leitura no runtime do servidor.
  // Assim, o App Setting do Azure funciona mesmo quando a imagem foi
  // construída sem as variáveis NEXT_PUBLIC_* incorporadas ao bundle.
  const whatsappNumber = process.env.WHATSAPP_NUMBER || null
  const instagramUrl = process.env.INSTAGRAM_URL || null

  return NextResponse.json(
    { whatsappNumber, instagramUrl },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
