import { getServerApiUrl } from '@/service/server_api'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type RouteContext = {
  params: Promise<{ path: string[] }>
}

const BODYLESS_METHODS = new Set(['GET', 'HEAD'])

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  const upstreamPath = path.map(segment => encodeURIComponent(segment)).join('/')
  const upstreamUrl = new URL(upstreamPath, `${getServerApiUrl()}/`)
  upstreamUrl.search = request.nextUrl.search

  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.delete('connection')
  headers.delete('content-length')

  try {
    const response = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body: BODYLESS_METHODS.has(request.method)
        ? undefined
        : await request.arrayBuffer(),
      cache: 'no-store',
      redirect: 'manual',
    })

    const responseHeaders = new Headers(response.headers)
    responseHeaders.delete('connection')
    responseHeaders.delete('content-encoding')
    responseHeaders.delete('content-length')
    responseHeaders.delete('transfer-encoding')

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('Nest API proxy request failed', {
      method: request.method,
      path: upstreamUrl.pathname,
      error,
    })

    return NextResponse.json(
      { message: 'Não foi possível acessar o serviço da API.' },
      { status: 502 }
    )
  }
}

export const GET = proxyRequest
export const POST = proxyRequest
export const PUT = proxyRequest
export const PATCH = proxyRequest
export const DELETE = proxyRequest
export const OPTIONS = proxyRequest
export const HEAD = proxyRequest
