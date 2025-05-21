import { jwtVerify } from 'jose'
import { NextResponse, NextRequest } from 'next/server'
import { publicRoutes, restrictedRoutes } from './routes'

const JWT_SECRET = process.env.JWT_SECRET!


export async function middleware(request: NextRequest) {

    const { pathname } = request.nextUrl
    const cookieStore = request.cookies
    const token = cookieStore.get('token')?.value


    let isLoggedIn = false
    if (token) {
        try {
            const secret = new TextEncoder().encode(JWT_SECRET)
            await jwtVerify(token, secret)
            isLoggedIn = true
        } catch (error) {
            console.error('Invalid token:', error)
            isLoggedIn = false
        }
    }

    // Prevent logged-in users from accessing auth routes
    if (isLoggedIn && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Allow access to public routes
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.next()
    }

    //  restrictted routes
    if (restrictedRoutes.some((route) => pathname.startsWith(route))) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        try {
            const secret = new TextEncoder().encode(JWT_SECRET)
            await jwtVerify(token, secret)
            return NextResponse.next()
        } catch (error) {
            console.error('Invalid token:', error)
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}