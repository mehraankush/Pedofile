import LoginPage from '@/components/core/loginComponents/MainSection'
import React, { Suspense } from 'react'

const page = () => {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        }>
            <LoginPage />
        </Suspense>
    )
}

export default page