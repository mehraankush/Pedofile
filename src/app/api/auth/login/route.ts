import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import clientPromise from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: NextRequest) {
    try {

        const body = await req.json()
        const { email, password } = body
        const cookieStore = await cookies()

        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Missing fields',
                },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db()
        const user = await db.collection('users').findOne({ email })

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid credentials',
                },
                { status: 401 }
            )
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid credentials',
                },
                { status: 401 }
            )
        }

        const { password:pass, ...userWithoutPassword } = user;
        console.log("password", pass)
        const token = jwt.sign({ user: userWithoutPassword }, JWT_SECRET, { expiresIn: '7d' })

        cookieStore.set('token', token, {
            // httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Logged in successfully',
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error in login:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
            },
            { status: 500 }
        )
    }
}
