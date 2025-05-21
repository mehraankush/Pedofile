import React from 'react'
import UserPdfCOmponent from '@/components/core/pdfComponents/UserPdfCOmponent';


type tParams = Promise<{ id: string }>;


const page = async ({ params }: { params: tParams }) => {
    const { id } = await params

    return (
        <div className="bg-white min-h-screen">
            <UserPdfCOmponent
                id={id}
            />
        </div>
    )
}

export default page