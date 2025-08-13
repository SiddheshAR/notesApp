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

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
  }

  const notes = await db.note.findMany({
    where: { userId: payload.userId },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json({ success: true, data: notes })
}

export async function POST(req) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = noteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Error" }, { status: 400 })
  }

  const { title, content } = parsed.data
  const note = await db.note.create({
    data: {
      title,
      content,
      userId: payload.userId,
    },
  })

  return NextResponse.json({ success: true, data: note }, { status: 201 })
}
