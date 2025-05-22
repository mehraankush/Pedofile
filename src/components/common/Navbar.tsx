"use client"
import React from 'react'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { Button } from '../ui/button'
import UserMenu from '../core/dashboard/UserMenu'
import { useAuth } from '@/hooks/UserAuth'

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="border-b ">
            <div className="container flex items-center justify-between py-4 px-3 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <FileText className="h-6 w-6" />
                    <h1 className="text-xl font-bold">PedoFile</h1>
                </div>
                {
                    user && user ? (
                        <UserMenu />
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login">
                                <Button variant="outline" className='cursor-pointer' >Login</Button>
                            </Link>

                        </div>
                    )
                }

            </div>
        </header>
    )
}

export default Navbar