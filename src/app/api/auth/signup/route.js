export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, generateToken } from '@/lib/auth'
import { signUpSchema } from '@/lib/validations'

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate with Zod
    const validationResult = signUpSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Error'
      }, { status: 400 })
    }

    const { name, email, password } = validationResult.data

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User with this email already exists'
      }, { status: 409 })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name
    })

    // Remove password from response
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    // Set httpOnly cookie
    const response = NextResponse.json({
      success: true,
      data: safeUser,
      message: 'User created successfully'
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
