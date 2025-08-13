import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, generateToken } from '@/lib/auth'
import { signInSchema } from '@/lib/validations'

export async function POST(req) {
  try {
    const body = await req.json()

    /* 1️⃣  validate only email + password */
    const parsed = signInSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: "Something went wrong."
      }, { status: 400 })
    }

    const { email, password } = parsed.data

    /* 2️⃣  locate the user */
    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 })
    }

    /* 3️⃣  check password */
    const ok = await verifyPassword(password, user.password)
    if (!ok) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 })
    }

    /* 4️⃣  create JWT & cookie */
    const token = generateToken({ userId: user.id, email, name: user.name })

    const safe = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    const res = NextResponse.json({
      success: true,
      data: safe,
      message: 'Signed in successfully'
    })

    res.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })

    return res
  } catch (err) {
    console.error('signin error', err)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
