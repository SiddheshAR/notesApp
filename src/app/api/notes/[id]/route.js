export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
})

async function authenticate() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function GET(_, { params }) {
  const { id } = await params
  
  const user = await authenticate()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const note = await db.note.findFirst({ where: { id, userId: user.userId } })
  if (!note) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

  return NextResponse.json({ success: true, data: note })
}

export async function PUT(req, { params }) {
  const { id } = await params
  
  const user = await authenticate()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = noteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Error" }, { status: 400 })
  }

  const updated = await db.note.updateMany({
    where: { id, userId: user.userId },
    data: { ...parsed.data },
  })
  if (!updated.count) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

  const note = await db.note.findUnique({ where: { id } })
  return NextResponse.json({ success: true, data: note })
}

export async function DELETE(_, { params }) {
  const { id } = await params
  
  const user = await authenticate()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  await db.note.deleteMany({ where: { id, userId: user.userId } })
  return NextResponse.json({ success: true, message: 'Deleted' })
}
