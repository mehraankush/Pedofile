'use client'

import { toast } from 'sonner'
import { IUser } from '@/models/User'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'

interface AuthState {
    user: IUser | null
    loading: boolean
    error: string | null
}

export function useAuth() {

    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        loading: true,
        error: null,
    })

    const router = useRouter()

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setAuthState({
                user: JSON.parse(storedUser),
                loading: false,
                error: null,
            })
        } else {
            fetchUser()
        }
    }, [])

    // Fetch user data from api
    const fetchUser = useCallback(async () => {
        try {
            setAuthState((prev) => ({ ...prev, loading: true, error: null }))
            const response = await fetch('/api/auth/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const data = await response.json()

            if (data.success) {
                setAuthState({
                    user: data.user,
                    loading: false,
                    error: null
                })
                localStorage.setItem('user', JSON.stringify(data.user))
            } else {
                setAuthState({
                    user: null,
                    loading: false,
                    error: data.message
                })
                localStorage.removeItem('user')
                toast.error(data.message || 'Failed to fetch user info')
                // router.push('/login')
            }
        } catch (err) {

            setAuthState({
                user: null,
                loading: false,
                error: 'Something went wrong. Please try again.' + err,
            })
            localStorage.removeItem('user')
            toast.error('Something went wrong. Please try again.')
            router.push('/login')
        }
    }, [router])

    const logout = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            })

            if (response.ok) {
                setAuthState({ user: null, loading: false, error: null })
                localStorage.removeItem('user')
                toast.success('Logged out successfully')
                router.push('/login')
            } else {
                const data = await response.json()
                toast.error(data.message || 'Logout failed')
            }
        } catch (error) {
            console.error('Error during logout:', error)
            toast.error('Something went wrong. Please try again.')
        }
    }, [router])


    return {
        user: authState.user,
        loading: authState.loading,
        error: authState.error,
        fetchUser,
        logout,
    }
}