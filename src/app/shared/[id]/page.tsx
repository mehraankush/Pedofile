import React from 'react'
import PDFViewerPage from '@/components/core/shared/MainComponent';

type tParams = Promise<{ id: string }>;


const page = async ({ params }: { params: tParams }) => {
    const { id } = await params

    return (
        <div className="bg-white min-h-screen">
            <PDFViewerPage
                id={id}
            />
        </div>
    )
}

export default page