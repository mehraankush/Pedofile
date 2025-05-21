import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET() {
    try {

        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value

        if (!token) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized'
            },
                { status: 401 })
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { user: { _id: string } }
        const client = await clientPromise
        const db = client.db()

        const userId = new ObjectId(decoded.user._id);

        const documents = await db
            .collection('Document')
            .find({ owner: userId })
            .toArray();

            // console.log("documents", documents)
        return NextResponse.json({
            success: true,
            data: documents
        }, { status: 200 })

    } catch (error) {
        console.error('Error fetching user PDFs:', error)
        return NextResponse.json({
            success: false,
            message: 'Internal server error'
        }, { status: 500 })
    }
}
