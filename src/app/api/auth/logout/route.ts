import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
    try {
        const cookieStore = await cookies()

        cookieStore.delete('token');

        return NextResponse.json(
            { success: true, message: 'Logged out successfully' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error in logout:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}
