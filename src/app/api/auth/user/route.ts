import { IUser } from '@/models/User'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'No token provided' },
                { status: 401 }
            )
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { user: IUser }

        // Return user information from the token
        return NextResponse.json(
            {
                success: true,
                user: decoded.user,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error fetching user info:', error)
        return NextResponse.json(
            { success: false, message: 'Invalid or expired token' },
            { status: 401 }
        )
    }
}