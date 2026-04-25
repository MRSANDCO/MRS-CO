// app/api/tax-mapper/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { oldToNew, newToOld } from '@/lib/taxMapping'

export function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)   // ✅ use req.url, not req.nextUrl
    
    const section   = searchParams.get('section')?.trim() ?? ''
    const direction = searchParams.get('dir') ?? 'old2new'

    if (!section) {
      return NextResponse.json({ error: 'Missing ?section= parameter' }, { status: 400 })
    }

    const source = direction === 'new2old' ? newToOld : oldToNew

    // ✅ Try exact match first, then uppercase, then lowercase
    const result =
      source[section] ??
      source[section.toUpperCase()] ??
      source[section.toLowerCase()] ??
      null

    if (!result) {
      return NextResponse.json(
        { error: `Section "${section}" not found`, direction },
        { status: 404 }
      )
    }

    return NextResponse.json({ section, direction, result })

  } catch (err) {
    console.error('[tax-mapper] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}