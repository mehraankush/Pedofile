import React from 'react'
import { Hourglass } from 'lucide-react'

const ComingSoonPage = () => {
    return (
        <div className="flex items-center justify-center  bg-white h-full text-black px-4">
            <div className="text-center space-y-6">
                <div className="flex justify-center">
                    <Hourglass className="h-12 w-12 text-yellow-400 animate-spin-slow" />
                </div>
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                    Coming Soon
                </h1>
                <p className="text-gray-400 text-lg max-w-md mx-auto">
                    {`We're working hard to bring something amazing. Stay tuned!`} 
                </p>
            </div>
        </div>
    )
}

export default ComingSoonPage
