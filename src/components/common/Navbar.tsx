import React from 'react'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { Button } from '../ui/button'

const Navbar = () => {
    return (
        <header className="border-b ">
            <div className="container flex items-center justify-between py-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <FileText className="h-6 w-6" />
                    <h1 className="text-xl font-bold">PDFCollab</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className='cursor-pointer' >Login</Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Navbar