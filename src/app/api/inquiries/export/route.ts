import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { csvCell } from '@/lib/csv'

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config })
    const auth = await payload.auth({ headers: request.headers })
    if (!auth.user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })

    const inquiries: Record<string, unknown>[] = []
    let page = 1
    let totalPages = 1
    do {
      const result = await payload.find({
        collection: 'inquiries',
        depth: 0,
        limit: 500,
        page,
        sort: '-createdAt',
        overrideAccess: false,
        user: auth.user,
      })
      inquiries.push(...result.docs as unknown as Record<string, unknown>[])
      totalPages = result.totalPages
      page += 1
    } while (page <= totalPages && page <= 101)

    const columns = ['createdAt', 'status', 'type', 'customerType', 'name', 'company', 'email', 'phone', 'application', 'vehicleOrEquipment', 'voltage', 'capacity', 'dimensions', 'quantity', 'message', 'adminNotes', 'followUpDate']
    const lines = [columns.map(csvCell).join(','), ...inquiries.map(record => columns.map(column => csvCell(record[column])).join(','))]
    return new Response(`\uFEFF${lines.join('\r\n')}`, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="green-volt-enquiries.csv"',
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return NextResponse.json({ error: 'The enquiry export is unavailable.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
