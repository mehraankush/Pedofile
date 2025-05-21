import bcrypt from 'bcryptjs'
import clientPromise from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {

    try {
      
        const body = await req.json();
        const { name, email, password } = body
        if (!name || !email || !password) {
            return NextResponse.json({
                success: false,
                message: 'All fields are required'
            },
                { status: 409 })
        }

        const client = await clientPromise
        const db = client.db()

        const existingUser = await db.collection('users').findOne({ email });
        // Check if user already exists
        if (existingUser) {
            return NextResponse.json({
                success: true,
                message: 'Email already exists'
            },
                { status: 409 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = {
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        }

        const result = await db.collection('users').insertOne(newUser)

        return NextResponse.json({
            success: true,
            message: 'User created',
            userId: result.insertedId,
        },
            { status: 201 })

    } catch (error) {
        console.error('Error in signup:', error)
        return NextResponse.json({
            success: false,
            message: 'Internal server error'
        },
            { status: 500 })
    }
}

