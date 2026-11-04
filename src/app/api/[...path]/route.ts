import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const API_BASE_URL = 'https://elitespacenepal.premiumasp.net'

const REQUEST_HEADERS = ['accept', 'authorization', 'content-type', 'cookie']
const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'content-length',
  'expect',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
])

async function proxyRequest(request: NextRequest): Promise<Response> {
  const incomingUrl = new URL(request.url)
  const upstreamUrl = `${API_BASE_URL}${incomingUrl.pathname}${incomingUrl.search}`
  const headers = new Headers()

  for (const header of REQUEST_HEADERS) {
    const value = request.headers.get(header)
    if (value) headers.set(header, value)
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body:
        request.method === 'GET' || request.method === 'HEAD'
          ? undefined
          : await request.arrayBuffer(),
      cache: 'no-store',
      redirect: 'manual',
    })
    const responseHeaders = new Headers(upstreamResponse.headers)

    for (const header of HOP_BY_HOP_HEADERS) {
      responseHeaders.delete(header)
    }
    responseHeaders.delete('content-encoding')

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error(`[API Proxy] ${request.method} ${incomingUrl.pathname} failed`, error)
    return Response.json({ message: 'Unable to reach the API server' }, { status: 502 })
  }
}

export const GET = proxyRequest
export const HEAD = proxyRequest
export const POST = proxyRequest
export const PUT = proxyRequest
export const PATCH = proxyRequest
export const DELETE = proxyRequest
export const OPTIONS = proxyRequest
